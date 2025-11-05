package com.ro.petrol_pump_ai.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {
    private Long employeeId;
    private String status;  // Present, Absent, Leave, Half-day
    private String remarks;
}
