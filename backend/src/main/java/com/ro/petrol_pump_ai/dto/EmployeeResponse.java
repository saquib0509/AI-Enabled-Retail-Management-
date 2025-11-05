package com.ro.petrol_pump_ai.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String role;
    private LocalDate hireDate;
    private String status;
    private String createdAt;
}
