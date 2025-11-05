package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.dto.AttendanceRequest;
import com.ro.petrol_pump_ai.dto.AttendanceResponse;
import com.ro.petrol_pump_ai.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceService;
    
    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceRequest request) {
        try {
            AttendanceResponse response = attendanceService.markAttendance(request.getEmployeeId(), request.getStatus());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/clock-out/{employeeId}")
    public ResponseEntity<?> clockOut(@PathVariable Long employeeId) {
        try {
            AttendanceResponse response = attendanceService.clockOut(employeeId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/today")
    public ResponseEntity<?> getTodayAttendance() {
        try {
            List<AttendanceResponse> responses = attendanceService.getTodayAttendance();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getEmployeeAttendanceByDateRange(
        @PathVariable Long employeeId,
        @RequestParam LocalDate startDate,
        @RequestParam LocalDate endDate) {
        try {
            List<AttendanceResponse> responses = attendanceService
                .getEmployeeAttendanceByDateRange(employeeId, startDate, endDate);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
