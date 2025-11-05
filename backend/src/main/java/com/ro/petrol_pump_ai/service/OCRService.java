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
            
            ChallanExtractedData data = new ChallanExtractedData();
            data.setRawText(text);
            data.setConfidence(80.0);
            return data;
        } catch (TesseractException e) {
            throw new RuntimeException("OCR failed: " + e.getMessage());
        } finally {
            convFile.delete();
        }
    }

    private File convertToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }
}
