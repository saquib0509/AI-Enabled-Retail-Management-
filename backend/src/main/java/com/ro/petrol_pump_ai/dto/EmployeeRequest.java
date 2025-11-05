package com.ro.petrol_pump_ai.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {
    private String name;
    private String phone;
    private String email;
    private String role;  // Attendant, Manager, Cashier
    private String status;  // Active, Inactive
}
