package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/test")
    public ResponseEntity<String> sendTestEmail(@RequestParam String email) {
        try {
            notificationService.sendStockAlert(email, "PETROL", 2.5, 50.0);
            return ResponseEntity.ok("✓ Test email sent to: " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }

    @PostMapping("/daily-report")
    public ResponseEntity<String> sendDailyReport(@RequestParam String email) {
        try {
            notificationService.sendDailySalesReport(email, 50000, 1200, 42.5, 150);
            return ResponseEntity.ok("✓ Daily report sent to: " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/attendance-alert")
    public ResponseEntity<String> sendAttendanceAlert(@RequestParam String email) {
        try {
            notificationService.sendAttendanceAlert(email, 75.0, 3, 4);
            return ResponseEntity.ok("Attendance alert sent to: " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/revenue-alert")
    public ResponseEntity<String> sendRevenueAlert(@RequestParam String email) {
        try {
            notificationService.sendRevenueAlert(email, 35000, 50000);
            return ResponseEntity.ok("Revenue alert sent to: " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
