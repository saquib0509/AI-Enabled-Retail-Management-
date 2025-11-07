package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.dto.SalaryStructureRequest;
import com.ro.petrol_pump_ai.dto.SalaryRecordResponse;
import com.ro.petrol_pump_ai.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/salary")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SalaryController {
    
    @Autowired
    private SalaryService salaryService;
    
    // Setup or update salary structure for employee
    @PostMapping("/structure")
    public ResponseEntity<?> setupSalaryStructure(@RequestBody SalaryStructureRequest request) {
        try {
            return ResponseEntity.ok(salaryService.createOrUpdateSalaryStructure(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Get salary structure for employee
    @GetMapping("/structure/{employeeId}")
    public ResponseEntity<?> getSalaryStructure(@PathVariable Long employeeId) {
        try {
            return ResponseEntity.ok(salaryService.getSalaryStructure(employeeId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Generate salary record for month
    @PostMapping("/generate/{employeeId}/{month}")
    public ResponseEntity<?> generateSalaryRecord(@PathVariable Long employeeId, @PathVariable String month) {
        try {
            return ResponseEntity.ok(salaryService.generateSalaryRecord(employeeId, month));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Get salary records for month
    @GetMapping("/month/{month}")
    public ResponseEntity<?> getSalaryRecordsByMonth(@PathVariable String month) {
        try {
            List<SalaryRecordResponse> records = salaryService.getSalaryRecordsByMonth(month);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Get salary record by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSalaryRecord(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(salaryService.getSalaryRecordById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Mark salary as paid
    @PutMapping("/{id}/mark-paid")
    public ResponseEntity<?> markAsPaid(@PathVariable Long id, @RequestParam String paymentMethod) {
        try {
            return ResponseEntity.ok(salaryService.markSalaryAsPaid(id, paymentMethod));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
