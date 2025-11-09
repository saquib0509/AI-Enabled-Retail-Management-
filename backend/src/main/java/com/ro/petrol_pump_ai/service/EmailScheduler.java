package com.ro.petrol_pump_ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.Map;

@Service
@EnableScheduling
public class EmailScheduler {

    private static final Logger logger = LoggerFactory.getLogger(EmailScheduler.class);

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private NotificationService notificationService;

    @Value("${app.owner.email:owner@petrolpump.com}")
    private String ownerEmail;

    /**
     * Send Daily Report at 6 PM every day
     */
    @Scheduled(cron = "0 0 18 * * ?")
    public void sendDailyReportEmail() {
        logger.info("📧 Sending Daily Report Email...");
        try {
            Map<String, Object> dashboard = dashboardService.getDashboardData();

            double revenue = (double) dashboard.getOrDefault("todayRevenue", 0.0);
            double sales = (double) dashboard.getOrDefault("todayQuantity", 0.0);
            double avgPrice = (double) dashboard.getOrDefault("avgDailyRevenue", 0.0);
            long transactions = 0; // Add this to dashboard if needed

            notificationService.sendDailySalesReport(ownerEmail, revenue, sales, avgPrice, transactions);
        } catch (Exception e) {
            logger.error("❌ Error sending daily report: " + e.getMessage());
        }
    }

    /**
     * Check Critical Alerts every 2 hours
     */
    @Scheduled(fixedRate = 7200000) // Every 2 hours
    public void checkAndSendCriticalAlerts() {
        logger.info("🔔 Checking for Critical Alerts...");
        try {
            Map<String, Object> dashboard = dashboardService.getDashboardData();

            double attendanceToday = (double) dashboard.getOrDefault("attendanceToday", 100.0);
            
            // Send attendance alert if below 80%
            if (attendanceToday < 80) {
                long presentToday = (long) dashboard.getOrDefault("presentToday", 0);
                long totalEmployees = (long) dashboard.getOrDefault("totalEmployees", 1);
                notificationService.sendAttendanceAlert(ownerEmail, attendanceToday, presentToday, totalEmployees);
            }

            // Check stock alerts
            @SuppressWarnings("unchecked")
            java.util.List<Map<String, Object>> stockAlerts = 
                (java.util.List<Map<String, Object>>) dashboard.getOrDefault("stockAlerts", new java.util.ArrayList<>());

            for (Map<String, Object> alert : stockAlerts) {
                String status = (String) alert.get("status");
                if ("CRITICAL".equals(status) || "WARNING".equals(status)) {
                    String product = (String) alert.get("product");
                    double daysUntilEmpty = Double.parseDouble(alert.get("daysUntilEmpty").toString());
                    double currentStock = (double) alert.get("currentStock");
                    notificationService.sendStockAlert(ownerEmail, product, daysUntilEmpty, currentStock);
                }
            }
        } catch (Exception e) {
            logger.error("❌ Error checking alerts: " + e.getMessage());
        }
    }

    /**
     * Send Monthly Report on 1st of every month at 9 AM
     */
    @Scheduled(cron = "0 0 9 1 * ?")
    public void sendMonthlyReportEmail() {
        logger.info("📧 Sending Monthly Report Email...");
        try {
            int year = java.time.LocalDate.now().getYear();
            int month = java.time.LocalDate.now().minusMonths(1).getMonthValue();
            
            // Fetch last month's data
            // You can create a method in ReportService to get monthly data
            
            notificationService.sendMonthlyReport(ownerEmail, 100000, 25.5, 15.2);
        } catch (Exception e) {
            logger.error("❌ Error sending monthly report: " + e.getMessage());
        }
    }
}
