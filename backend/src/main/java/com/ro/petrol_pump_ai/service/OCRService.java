package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.dto.ChallanExtractedData;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OCRService {

    private final Tesseract tesseract;

    public OCRService() {
        this.tesseract = new Tesseract();
        this.tesseract.setDatapath("C:/Program Files/Tesseract-OCR/tessdata");
        this.tesseract.setLanguage("eng");
    }

    public ChallanExtractedData extractChallanData(MultipartFile file) throws IOException {
        File convFile = convertToFile(file);
        
        try {
            String text = tesseract.doOCR(convFile);
            System.out.println("Extracted:\n" + text);
            
            return parseText(text);
        } catch (TesseractException e) {
            throw new RuntimeException("OCR failed: " + e.getMessage());
        } finally {
            convFile.delete();
        }
    }

    private ChallanExtractedData parseText(String text) {
    ChallanExtractedData data = new ChallanExtractedData();
    data.setRawText(text);
    
    // Extract Date (11-Jub25 format - the text has "Date 11-Jub25")
    Pattern datePattern = Pattern.compile("Date\\s+(\\d{1,2})-(\\w+)-(\\d{2})");
    Matcher dateMatcher = datePattern.matcher(text);
    if (dateMatcher.find()) {
        try {
            String day = dateMatcher.group(1);
            String month = dateMatcher.group(2); // "Jub" (typo for Jul)
            String year = dateMatcher.group(3);
            
            // Handle month typos: "Jub" -> "Jul"
            if (month.equalsIgnoreCase("Jub")) {
                month = "Jul";
            }
            
            String dateStr = day + "/" + month + "/" + year;
            data.setDate(parseDate(dateStr));
            System.out.println("Parsed date: " + data.getDate());
        } catch (Exception e) {
            System.out.println("Date parse error: " + e.getMessage());
        }
    }
    
    // Extract Fuel Type (EBMS = Petrol, HSD-BSVI = Diesel)
    if (text.contains("EBMS")) {
        data.setFuelType("Petrol");
    } else if (text.contains("HSD-BSVI") || text.contains("HSD")) {
        data.setFuelType("Diesel");
    }
    
    // Extract Quantity (8.000 KL pattern)
    Pattern qtyPattern = Pattern.compile("EBMS\\s+(\\d+\\.\\d+)\\s+KL");
    Matcher qtyMatcher = qtyPattern.matcher(text);
    if (qtyMatcher.find()) {
        try {
            data.setQuantity(Double.parseDouble(qtyMatcher.group(1)));
        } catch (NumberFormatException e) {
            System.out.println("Quantity parse error");
        }
    }
    
    // Extract Price Per Liter (77055.240 pattern)
    Pattern pricePattern = Pattern.compile("EBMS\\s+\\d+\\.\\d+\\s+KL[\\s\\w\\d.]+BASIC DESTINATION PRICE\\s+\\d+\\.\\d+\\s+KL\\s+([0-9.]+)");
    Matcher priceMatcher = pricePattern.matcher(text);
    if (priceMatcher.find()) {
        try {
            data.setPricePerLiter(Double.parseDouble(priceMatcher.group(1)));
        } catch (NumberFormatException e) {
            System.out.println("Price parse error");
        }
    }
    
    // Extract Total Amount (Total 1127197.00)
    Pattern totalPattern = Pattern.compile("Total\\s+([0-9]+\\.\\d+)");
    Matcher totalMatcher = totalPattern.matcher(text);
    if (totalMatcher.find()) {
        try {
            data.setTotalAmount(Double.parseDouble(totalMatcher.group(1)));
        } catch (NumberFormatException e) {
            System.out.println("Total parse error");
        }
    }
    
    // Extract Vendor Name (JANTA SERVICE STATION)
    Pattern vendorPattern = Pattern.compile("(JANTA\\s+[A-Z\\s]+STATION)");
    Matcher vendorMatcher = vendorPattern.matcher(text);
    if (vendorMatcher.find()) {
        data.setVendorName(vendorMatcher.group(1).trim());
    }
    
    // Extract Challan Number (20262324V010639)
    Pattern challanPattern = Pattern.compile("TAX INVOICE\\s+([0-9A-Z]+)");
    Matcher challanMatcher = challanPattern.matcher(text);
    if (challanMatcher.find()) {
        data.setChallanNumber(challanMatcher.group(1));
    }
    
    // Calculate confidence
    int filledFields = 0;
    if (data.getDate() != null) filledFields++;
    if (data.getFuelType() != null) filledFields++;
    if (data.getQuantity() != null) filledFields++;
    if (data.getPricePerLiter() != null) filledFields++;
    if (data.getTotalAmount() != null) filledFields++;
    if (data.getVendorName() != null) filledFields++;
    if (data.getChallanNumber() != null) filledFields++;
    
    data.setConfidence((filledFields / 7.0) * 100);
    
    return data;
}

private LocalDate parseDate(String dateStr) {
    DateTimeFormatter[] formatters = {
        DateTimeFormatter.ofPattern("d/MMM/yy"),
        DateTimeFormatter.ofPattern("dd/MMM/yyyy"),
        DateTimeFormatter.ofPattern("d/MMM/yyyy")
    };
    
    for (DateTimeFormatter formatter : formatters) {
        try {
            return LocalDate.parse(dateStr, formatter);
        } catch (Exception e) {
            // Try next
        }
    }
    System.out.println("Could not parse date: " + dateStr);
    return null;
}


    private File convertToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }
}
