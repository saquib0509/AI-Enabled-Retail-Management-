package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.entity.BusinessSettings;
import com.ro.petrol_pump_ai.service.BusinessSettingsService;
import com.ro.petrol_pump_ai.service.NotificationService;
import com.ro.petrol_pump_ai.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private BusinessSettingsService businessSettingsService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private DashboardService dashboardService;

    /**
     * Get current business settings
     * GET http://localhost:8080/api/settings
     */
    @GetMapping
    public ResponseEntity<BusinessSettings> getSettings() {
        try {
            BusinessSettings settings = businessSettingsService.getSettings();
            if (settings == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Save/Update business settings
     * POST http://localhost:8080/api/settings
     */
    @PostMapping
    public ResponseEntity<BusinessSettings> saveSettings(@RequestBody BusinessSettings settings) {
        try {
            BusinessSettings saved = businessSettingsService.saveSettings(settings);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Update business settings
     * PUT http://localhost:8080/api/settings/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<BusinessSettings> updateSettings(
            @PathVariable Long id,
            @RequestBody BusinessSettings settings) {
        try {
            return businessSettingsService.updateSettings(id, settings)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Send Daily Report Email Immediately (On-Demand)
     * When owner clicks button for immediate report
     * POST http://localhost:8080/api/settings/send-daily-report-now
     */
    @PostMapping("/send-daily-report-now")
    public ResponseEntity<String> sendDailyReportNow() {
        try {
            BusinessSettings settings = businessSettingsService.getSettings();
            if (settings == null) {
                return ResponseEntity.status(400).body("Settings not configured yet");
            }

            // Fetch today's dashboard data
            Map<String, Object> dashboard = dashboardService.getDashboardData();

            // Extract data
            double revenue = (double) dashboard.getOrDefault("todayRevenue", 0.0);
            double sales = (double) dashboard.getOrDefault("todayQuantity", 0.0);
            double attendance = (double) dashboard.getOrDefault("attendanceToday", 0.0);
            long presentToday = (long) dashboard.getOrDefault("presentToday", 0);
            long totalEmployees = (long) dashboard.getOrDefault("totalEmployees", 0);
            String topProduct = (String) dashboard.getOrDefault("topProduct7Days", "N/A");

            // Send via NotificationService (which will use EmailService)
            notificationService.sendDailySalesReport(
                settings.getEmailAddress(),
                revenue,
                sales,
                revenue / (sales > 0 ? sales : 1),  // avg price per liter
                0
            );

            return ResponseEntity.ok(
                "✓ Daily report sent NOW to: " + settings.getEmailAddress() + "\n" +
                "Revenue: ₹" + String.format("%.0f", revenue) + "\n" +
                "Sales: " + String.format("%.0f", sales) + "L\n" +
                "Attendance: " + String.format("%.0f", attendance) + "%\n" +
                "Top Product: " + topProduct
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /**
     * Send Stock Alert Email Immediately
     * POST http://localhost:8080/api/settings/send-stock-alert-now
     */
    @PostMapping("/send-stock-alert-now")
    public ResponseEntity<String> sendStockAlertNow() {
        try {
            BusinessSettings settings = businessSettingsService.getSettings();
            if (settings == null) {
                return ResponseEntity.status(400).body("Settings not configured yet");
            }

            Map<String, Object> dashboard = dashboardService.getDashboardData();
            
            @SuppressWarnings("unchecked")
            java.util.List<Map<String, Object>> stockAlerts = 
                (java.util.List<Map<String, Object>>) dashboard.getOrDefault("stockAlerts", new java.util.ArrayList<>());

            if (stockAlerts.isEmpty()) {
                return ResponseEntity.ok("No stock alerts to send");
            }

            // Send each critical/warning alert
            for (Map<String, Object> alert : stockAlerts) {
                String status = (String) alert.get("status");
                if ("CRITICAL".equals(status) || "WARNING".equals(status)) {
                    String product = (String) alert.get("product");
                    double daysUntilEmpty = Double.parseDouble(alert.get("daysUntilEmpty").toString());
                    double currentStock = (double) alert.get("currentStock");
                    notificationService.sendStockAlert(settings.getEmailAddress(), product, daysUntilEmpty, currentStock);
                }
            }

            return ResponseEntity.ok("Stock alerts sent to: " + settings.getEmailAddress());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /**
     * Send Attendance Report Email Immediately
     * POST http://localhost:8080/api/settings/send-attendance-now
     */
    @PostMapping("/send-attendance-now")
    public ResponseEntity<String> sendAttendanceNow() {
        try {
            BusinessSettings settings = businessSettingsService.getSettings();
            if (settings == null) {
                return ResponseEntity.status(400).body("❌ Settings not configured yet");
            }

            Map<String, Object> dashboard = dashboardService.getDashboardData();

            double attendance = (double) dashboard.getOrDefault("attendanceToday", 0.0);
            long presentToday = (long) dashboard.getOrDefault("presentToday", 0);
            long totalEmployees = (long) dashboard.getOrDefault("totalEmployees", 0);

            notificationService.sendAttendanceAlert(
                settings.getEmailAddress(),
                attendance,
                presentToday,
                totalEmployees
            );

            return ResponseEntity.ok("✓ Attendance report sent to: " + settings.getEmailAddress());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }
}
