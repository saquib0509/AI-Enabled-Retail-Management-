package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.dto.DailyEntryRequest;
import com.ro.petrol_pump_ai.dto.DailyEntryResponse;
import com.ro.petrol_pump_ai.service.DailyEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/daily-entries")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DailyEntryController {
    
    @Autowired
    private DailyEntryService dailyEntryService;
    
    @PostMapping
    public ResponseEntity<?> createDailyEntry(@RequestBody DailyEntryRequest request) {
        try {
            DailyEntryResponse response = dailyEntryService.createDailyEntry(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEntryById(@PathVariable Long id) {
        try {
            DailyEntryResponse response = dailyEntryService.getEntryById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/today")
    public ResponseEntity<?> getTodayEntries() {
        try {
            List<DailyEntryResponse> responses = dailyEntryService.getTodayEntries();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/last7days")
    public ResponseEntity<?> getLast7DaysEntries() {
        try {
            List<DailyEntryResponse> responses = dailyEntryService.getLast7DaysEntries();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/product/{productId}/last")
    public ResponseEntity<?> getLastEntryForProduct(@PathVariable Long productId) {
        try {
            DailyEntryResponse response = dailyEntryService.getLastEntryForProduct(productId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDailyEntry(@PathVariable Long id, @RequestBody DailyEntryRequest request) {
        try {
            DailyEntryResponse response = dailyEntryService.updateDailyEntry(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDailyEntry(@PathVariable Long id) {
        try {
            dailyEntryService.deleteDailyEntry(id);
            return ResponseEntity.ok("{\"message\": \"Entry deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
