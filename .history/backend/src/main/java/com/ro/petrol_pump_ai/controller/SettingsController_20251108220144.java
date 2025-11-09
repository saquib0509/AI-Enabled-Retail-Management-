package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.entity.BusinessSettings;
import com.ro.petrol_pump_ai.service.BusinessSettingsService;
import com.ro.petrol_pump_ai.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private BusinessSettingsService businessSettingsService;

    @Autowired
    private NotificationService notificationService;

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
     * Send Test Email Immediately
     * POST http://localhost:8080/api/settings/send-test-email
     */
    @PostMapping("/send-test-email")
    public ResponseEntity<String> sendTestEmail() {
        try {
            BusinessSettings settings = businessSettingsService.getSettings();
            if (settings == null) {
                return ResponseEntity.status(400).body("❌ Settings not configured yet");
            }
            
            String testEmail = String.format(
                "Test Email from %s\n\n" +
                "Owner: %s\n" +
                "Address: %s\n" +
                "GST: %s\n\n" +
                "This is a test email. All notifications will be sent to this address.",
                settings.getCompanyName(),
                settings.getOwnerName(),
                settings.getBusinessAddress(),
                settings.getGstNumber()
            );
            
            emailService.sendSimpleEmail(...);
(
                settings.getEmailAddress(),
                "🧪 Test Email - " + settings.getCompanyName(),
                testEmail
            );
            
            return ResponseEntity.ok("✓ Test email sent to: " + settings.getEmailAddress());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }
}
