package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.entity.CrowdMetrics;
import com.ro.petrol_pump_ai.service.CrowdMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crowd-detection")
@CrossOrigin(origins = "*")
public class CrowdDetectionController {
    
    @Autowired
    private CrowdMetricsService crowdMetricsService;
    
    /**
     * Receive crowd data from Python service
     * POST http://localhost:8080/api/crowd-detection/save
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveCrowdData(
        @RequestParam Integer crowdCount,
        @RequestParam Double confidence) {
        try {
            CrowdMetrics saved = crowdMetricsService.saveCrowdMetrics(crowdCount, confidence);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Get today's crowd metrics
     * GET http://localhost:8080/api/crowd-detection/today
     */
    @GetMapping("/today")
    public ResponseEntity<?> getTodayMetrics() {
        try {
            List<CrowdMetrics> metrics = crowdMetricsService.getTodayMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Get peak hours
     * GET http://localhost:8080/api/crowd-detection/peak-hours
     */
    @GetMapping("/peak-hours")
    public ResponseEntity<?> getPeakHours() {
        try {
            List<CrowdMetrics> peakHours = crowdMetricsService.getPeakHours();
            return ResponseEntity.ok(peakHours);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Get hourly analysis
     * GET http://localhost:8080/api/crowd-detection/hourly-analysis
     */
    @GetMapping("/hourly-analysis")
    public ResponseEntity<?> getHourlyAnalysis() {
        try {
            Map<String, Object> analysis = crowdMetricsService.getHourlyAnalysis();
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Get last N records
     * GET http://localhost:8080/api/crowd-detection/recent?limit=20
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentRecords(
        @RequestParam(defaultValue = "20") int limit) {
        try {
            List<CrowdMetrics> records = crowdMetricsService.getLastNRecords(limit);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
