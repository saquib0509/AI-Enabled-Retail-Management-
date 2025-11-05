package com.ro.petrol_pump_ai.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallanRequest {
    
    // These are the fields you'll fill AFTER OCR extraction
    // User confirms/edits the auto-extracted data before saving
    
    private LocalDate date;
    private String fuelType;        // Petrol/Diesel
    private Double quantity;        // Liters
    private Double pricePerLiter;
    private Double totalAmount;
    private String vendorName;
    private String challanNumber;
}
