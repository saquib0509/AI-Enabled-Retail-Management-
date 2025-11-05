package com.ro.petrol_pump_ai.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallanResponse {
    private Long id;
    private LocalDate date;
    private String fuelType;
    private Double quantity;
    private Double pricePerLiter;
    private Double totalAmount;
    private String vendorName;
    private String challanNumber;
}
