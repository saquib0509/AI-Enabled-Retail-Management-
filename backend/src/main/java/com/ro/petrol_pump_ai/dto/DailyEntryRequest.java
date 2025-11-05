package com.ro.petrol_pump_ai.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyEntryRequest {
    
    private LocalDate entryDate;
    private Long productId;  // Which product (Petrol/Diesel/CNG)
    private Double openingStock;
    private Double salesToday;
    private Double underTankDelivery;  // Optional
    private Double pricePerUnit;       // Price per Liter/Kg
    private Double temperature;        // Optional
    private String notes;              // Optional
}
