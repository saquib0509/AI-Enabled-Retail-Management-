package com.ro.petrol_pump_ai.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyEntryResponse {
    
    private Long id;
    private LocalDate entryDate;
    private String productName;
    private Double openingStock;
    private Double salesToday;
    private Double underTankDelivery;
    private Double closingStock;      // Auto-calculated
    private Double pricePerUnit;
    private Double dailyRevenue;      // Auto-calculated
    private Double temperature;
    private String notes;
    private String createdAt;
}
