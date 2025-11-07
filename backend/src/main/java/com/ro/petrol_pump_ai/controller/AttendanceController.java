package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.dto.AttendanceRequest;
import com.ro.petrol_pump_ai.dto.AttendanceResponse;
import com.ro.petrol_pump_ai.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
    
    // Mark/Create or Update attendance
    @PostMapping
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceRequest request) {
        try {
            AttendanceResponse response = attendanceService.markAttendance(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Get attendance for specific date
    @GetMapping("/date/{date}")
    public ResponseEntity<?> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<AttendanceResponse> responses = attendanceService.getAttendanceByDate(date);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Get attendance for date range
    @GetMapping("/date-range")
    public ResponseEntity<?> getAttendanceByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<AttendanceResponse> responses = attendanceService.getAttendanceByDateRange(startDate, endDate);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Get employee attendance for date range
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getEmployeeAttendance(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<AttendanceResponse> responses = attendanceService.getEmployeeAttendance(employeeId, startDate, endDate);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Get attendance by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAttendanceById(@PathVariable Long id) {
        try {
            AttendanceResponse response = attendanceService.getAttendanceById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Update attendance
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(@PathVariable Long id, @RequestBody AttendanceRequest request) {
        try {
            AttendanceResponse response = attendanceService.updateAttendance(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Delete attendance
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        try {
            attendanceService.deleteAttendance(id);
            return ResponseEntity.ok("{\"message\": \"Attendance deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
