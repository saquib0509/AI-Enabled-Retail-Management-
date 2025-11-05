package com.ro.petrol_pump_ai.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LocalDate attendanceDate;
    private String checkInTime;
    private String checkOutTime;
    private String status;
    private String remarks;
}
