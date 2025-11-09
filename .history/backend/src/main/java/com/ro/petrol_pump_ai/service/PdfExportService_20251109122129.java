package com.ro.petrol_pump_ai.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.ro.petrol_pump_ai.dto.DailyEntryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfExportService {

    @Autowired
    private DailyEntryService dailyEntryService;

    public byte[] generateEntriesPdf(LocalDate fromDate, LocalDate toDate) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, baos);
        document.open();

        // Title
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
        Paragraph title = new Paragraph("Daily Entries Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        // Date Range
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        Font dateFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
        Paragraph dateRange = new Paragraph(
            "From: " + fromDate.format(formatter) + " To: " + toDate.format(formatter),
            dateFont
        );
        dateRange.setAlignment(Element.ALIGN_CENTER);
        document.add(dateRange);
        document.add(new Paragraph("\n"));

        // Table
        PdfPTable table = new PdfPTable(11);
        table.setWidthPercentage(100);

        // Headers
        String[] headers = {"Date", "Product", "Opening", "Sales", "Delivery", "Closing", "Price", "Revenue", "Temp", "Notes", "Created"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD)));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        // Fetch data
        List<DailyEntryResponse> entries = dailyEntryService.getEntriesByDateRange(fromDate, toDate);

        // Add data rows
        for (DailyEntryResponse entry : entries) {
            addTableRow(table, entry);
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }

    private void addTableRow(PdfPTable table, DailyEntryResponse entry) {
        Font dataFont = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL);

        PdfPCell cell;

        // Date
        cell = new PdfPCell(new Phrase(entry.getEntryDate().toString(), dataFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        // Product
        cell = new PdfPCell(new Phrase(entry.getProductName(), dataFont));
        table.addCell(cell);

        // Opening Stock
        cell = new PdfPCell(new Phrase(String.format("%.2f", entry.getOpeningStock()), dataFont));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell);

        // Sales Today
        cell = new PdfPCell(new Phrase(String.format("%.2f", entry.getSalesToday()), dataFont));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell);

        // Under Tank Delivery
        cell = new PdfPCell(new Phrase(String.format("%.2f", entry.getUnderTankDelivery()), dataFont));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell);

        // Closing Stock
        cell = new PdfPCell(new Phrase(String.format("%.2f", entry.getClosingStock()), dataFont));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell);

        // Price Per Unit
        cell = new PdfPCell(new Phrase(String.format("%.2f", entry.getPricePerUnit()), dataFont));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell);

        // Daily Revenue
        cell = new PdfPCell(new Phrase(String.format("%.2f", entry.getDailyRevenue()), dataFont));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cell);

        // Temperature
        cell = new PdfPCell(new Phrase(entry.getTemperature() != null ? entry.getTemperature().toString() : "N/A", dataFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);

        // Notes
        cell = new PdfPCell(new Phrase(entry.getNotes() != null ? entry.getNotes() : "", dataFont));
        table.addCell(cell);

        // Created At
        cell = new PdfPCell(new Phrase(entry.getCreatedAt() != null ? entry.getCreatedAt() : "", dataFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }
}
