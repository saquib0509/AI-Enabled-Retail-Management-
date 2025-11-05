package com.ro.petrol_pump_ai.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallanExtractedData {
    private LocalDate date;
    private String fuelType;        // Petrol/Diesel
    private Double quantity;        // Liters
    private Double pricePerLiter;
    private Double totalAmount;
    private String vendorName;
    private String challanNumber;
    private String rawText;         // Full OCR extracted text
    private Double confidence;      // Extraction confidence score
}
