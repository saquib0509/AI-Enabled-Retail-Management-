package com.ro.petrol_pump_ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private EmailService emailService;

    /**
     * Send Stock Alert Email
     */
    public void sendStockAlert(String recipientEmail, String productName, double daysUntilEmpty, double currentStock) {
        String subject = "🚨 ALERT: Stock Running Low - " + productName;
        
        String body = String.format(
            "Dear Manager,\n\n" +
            "⚠️ URGENT STOCK ALERT ⚠️\n\n" +
            "Product: %s\n" +
            "Current Stock: %.2f L\n" +
            "Days Until Empty: %.1f days\n\n" +
            "ACTION REQUIRED: Please place an immediate reorder.\n\n" +
            "Best Regards,\n" +
            "Petrol Pump AI System",
            productName, currentStock, daysUntilEmpty
        );

        emailService.sendSimpleEmail(recipientEmail, subject, body);
    }

    /**
     * Send Daily Sales Report Email
     */
    public void sendDailySalesReport(String recipientEmail, double revenue, double sales, 
                                     double avgPrice, long transactionCount) {
        String subject = "📊 Daily Sales Report - " + java.time.LocalDate.now();
        
        String body = String.format(
            "Daily Sales Report\n\n" +
            "Date: %s\n" +
            "Total Revenue: ₹%.2f\n" +
            "Total Sales: %.2f L\n" +
            "Avg Price/Liter: ₹%.2f\n" +
            "Transactions: %d\n\n" +
            "Best Regards,\n" +
            "Petrol Pump AI System",
            java.time.LocalDate.now(), revenue, sales, avgPrice, transactionCount
        );

        emailService.sendSimpleEmail(recipientEmail, subject, body);
    }

    /**
     * Send Attendance Alert Email
     */
    public void sendAttendanceAlert(String recipientEmail, double attendancePercent, long presentEmployees, long totalEmployees) {
        String subject = "Attendance Alert - " + java.time.LocalDate.now();
        
        String body = String.format(
            "Attendance Report\n\n" +
            "Date: %s\n" +
            "Present: %d / %d\n" +
            "Attendance Percentage: %.1f%%\n\n" +
            "%s\n\n" +
            "Best Regards,\n" +
            "Petrol Pump AI System",
            java.time.LocalDate.now(), presentEmployees, totalEmployees, attendancePercent,
            attendancePercent < 80 ? "⚠️ Attendance below 80% - Please address this." : "✓ Good attendance today."
        );

        emailService.sendSimpleEmail(recipientEmail, subject, body);
    }

    /**
     * Send Revenue Alert Email
     */
    public void sendRevenueAlert(String recipientEmail, double todayRevenue, double expectedRevenue) {
        String subject = "📈 Revenue Alert";
        
        double difference = expectedRevenue - todayRevenue;
        String status = todayRevenue >= expectedRevenue ? "✓ EXCEEDING TARGET" : "⚠️ BELOW TARGET";
        
        String body = String.format(
            "Revenue Report\n\n" +
            "Status: %s\n\n" +
            "Today's Revenue: ₹%.2f\n" +
            "Expected Revenue: ₹%.2f\n" +
            "Difference: ₹%.2f\n\n" +
            "Best Regards,\n" +
            "Petrol Pump AI System",
            status, todayRevenue, expectedRevenue, difference
        );

        emailService.sendSimpleEmail(recipientEmail, subject, body);
    }

    /**
     * Send Monthly Performance Report
     */
    public void sendMonthlyReport(String recipientEmail, double monthRevenue, double profitMargin, 
                                  double monthOnMonthGrowth) {
        String subject = "📅 Monthly Performance Report - " + java.time.YearMonth.now();
        
        String body = String.format(
            "Monthly Performance Report\n\n" +
            "Month: %s\n\n" +
            "Total Revenue: ₹%.2f\n" +
            "Profit Margin: %.2f%%\n" +
            "MoM Growth: %.2f%%\n\n" +
            "Best Regards,\n" +
            "Petrol Pump AI System",
            java.time.YearMonth.now(), monthRevenue, profitMargin, monthOnMonthGrowth
        );

        emailService.sendSimpleEmail(recipientEmail, subject, body);
    }
}
