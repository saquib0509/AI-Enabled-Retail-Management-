package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StockMovementReportService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    public Map<String, Object> generateStockMovementReport(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);

        Map<String, Object> report = new HashMap<>();

        // Sort by date
        entries = entries.stream()
            .sorted(Comparator.comparing(DailyEntry::getEntryDate))
            .collect(Collectors.toList());

        // ===== DAILY STOCK DATA =====
        List<Map<String, Object>> stockData = entries.stream().map(e -> {
            Map<String, Object> day = new HashMap<>();
            day.put("date", e.getEntryDate().toString());
            day.put("dateLabel", e.getEntryDate().getDayOfMonth() + "/" + e.getEntryDate().getMonthValue());
            day.put("openingStock", e.getOpeningStock() != null ? e.getOpeningStock() : 0);
            day.put("closingStock", e.getClosingStock() != null ? e.getClosingStock() : 0);
            day.put("consumption", e.getOpeningStock() != null && e.getClosingStock() != null
                ? (e.getOpeningStock() - e.getClosingStock())
                : 0);
            day.put("delivery", e.getUnderTankDelivery() != null ? e.getUnderTankDelivery() : 0);
            return day;
        }).collect(Collectors.toList());

        report.put("stockData", stockData);

        // ===== CONSUMPTION ANALYSIS =====
        double totalConsumption = entries.stream()
            .mapToDouble(e -> e.getOpeningStock() != null && e.getClosingStock() != null
                ? (e.getOpeningStock() - e.getClosingStock())
                : 0)
            .sum();
        double avgDailyConsumption = entries.size() > 0 ? totalConsumption / entries.size() : 0;
        double maxDailyConsumption = entries.stream()
            .mapToDouble(e -> e.getOpeningStock() != null && e.getClosingStock() != null
                ? (e.getOpeningStock() - e.getClosingStock())
                : 0)
            .max().orElse(0);
        double minDailyConsumption = entries.stream()
            .mapToDouble(e -> e.getOpeningStock() != null && e.getClosingStock() != null
                ? (e.getOpeningStock() - e.getClosingStock())
                : 0)
            .min().orElse(0);

        report.put("totalConsumption", totalConsumption);
        report.put("avgDailyConsumption", avgDailyConsumption);
        report.put("maxDailyConsumption", maxDailyConsumption);
        report.put("minDailyConsumption", minDailyConsumption);

        // ===== CURRENT STOCK STATUS =====
        Optional<DailyEntry> lastEntry = entries.stream()
            .max(Comparator.comparing(DailyEntry::getEntryDate));

        double currentStock = lastEntry.map(e -> e.getClosingStock() != null ? e.getClosingStock() : 0).orElse(0.0);
        double openingStock = entries.stream()
            .findFirst()
            .map(e -> e.getOpeningStock() != null ? e.getOpeningStock() : 0)
            .orElse(0.0);

        report.put("currentStock", currentStock);
        report.put("openingStock", openingStock);

        // ===== STOCK PROJECTIONS & ALERTS =====
        double daysUntilEmpty = avgDailyConsumption > 0 ? currentStock / avgDailyConsumption : Double.MAX_VALUE;
        double daysUntilCritical = avgDailyConsumption > 0 ? (currentStock * 0.25) / avgDailyConsumption : Double.MAX_VALUE; // 25% threshold

        report.put("daysUntilEmpty", daysUntilEmpty);
        report.put("daysUntilCritical", daysUntilCritical);

        // ===== DELIVERY ANALYSIS =====
        double totalDelivery = entries.stream()
            .mapToDouble(e -> e.getUnderTankDelivery() != null ? e.getUnderTankDelivery() : 0)
            .sum();
        int deliveryDaysCount = (int) entries.stream()
            .filter(e -> e.getUnderTankDelivery() != null && e.getUnderTankDelivery() > 0)
            .count();

        report.put("totalDelivery", totalDelivery);
        report.put("deliveryDaysCount", deliveryDaysCount);

        // ===== STOCK TREND =====
        double stockChange = currentStock - openingStock;
        String stockTrend = stockChange > 0 ? "Increasing" : (stockChange < 0 ? "Decreasing" : "Stable");

        report.put("stockChange", stockChange);
        report.put("stockTrend", stockTrend);

        // ===== ENHANCED AI INSIGHTS =====
        report.put("aiInsights", generateEnhancedAIInsights(
            currentStock, openingStock, avgDailyConsumption,
            daysUntilEmpty, daysUntilCritical, totalDelivery,
            stockTrend, maxDailyConsumption, minDailyConsumption
        ));

        return report;
    }

    private Map<String, Object> generateEnhancedAIInsights(
            double currentStock, double openingStock, double avgDailyConsumption,
            double daysUntilEmpty, double daysUntilCritical,
            double totalDelivery, String stockTrend,
            double maxConsumption, double minConsumption) {

        Map<String, Object> insights = new HashMap<>();

        // 1. Stock Health Status
        String healthStatus;
        String healthEmoji;
        if (currentStock > avgDailyConsumption * 7) {
            healthStatus = "Excellent - Well Stocked";
            healthEmoji = "";
        } else if (currentStock > avgDailyConsumption * 3) {
            healthStatus = "Good - Adequate Stock";
            healthEmoji = "";
        } else if (currentStock > avgDailyConsumption * 1) {
            healthStatus = "Warning - Low Stock";
            healthEmoji = "";
        } else {
            healthStatus = "Critical - Emergency Reorder";
            healthEmoji = "";
        }
        insights.put("healthStatus", healthStatus);
        insights.put("healthEmoji", healthEmoji);

        // 2. Reorder Urgency
        String reorderUrgency;
        if (daysUntilCritical < 1) {
            reorderUrgency = "IMMEDIATE - Order NOW!";
        } else if (daysUntilCritical < 3) {
            reorderUrgency = "URGENT - Order within 24 hours";
        } else if (daysUntilEmpty < 7) {
            reorderUrgency = "HIGH - Plan reorder this week";
        } else {
            reorderUrgency = "NORMAL - Monitor stock";
        }
        insights.put("reorderUrgency", reorderUrgency);

        // 3. Consumption Pattern
        String consumptionPattern;
        double variance = maxConsumption - minConsumption;
        double variancePercent = avgDailyConsumption > 0 ? (variance / avgDailyConsumption) * 100 : 0;

        if (variancePercent < 20) {
            consumptionPattern = "Very Stable - Predictable demand";
        } else if (variancePercent < 40) {
            consumptionPattern = "Stable - Consistent consumption";
        } else if (variancePercent < 60) {
            consumptionPattern = "Moderate Variance - Some fluctuation";
        } else {
            consumptionPattern = "High Variance - Unpredictable demand";
        }
        insights.put("consumptionPattern", consumptionPattern);
        insights.put("variancePercent", variancePercent);

        // 4. Stock Projection (next 30 days)
        double projectedStockAfter30Days = currentStock - (avgDailyConsumption * 30);
        String projectionAlert;
        if (projectedStockAfter30Days < 0) {
            projectionAlert = "⚠️ Stock will run out in " + String.format("%.1f", daysUntilEmpty) + " days. Plan multiple reorders.";
        } else if (projectedStockAfter30Days < avgDailyConsumption * 3) {
            projectionAlert = "Stock will be low in 30 days. Increase order frequency.";
        } else {
            projectionAlert = "Stock levels expected to remain adequate for next 30 days.";
        }
        insights.put("projectionAlert", projectionAlert);

        // 5. Delivery Efficiency
        String deliveryStatus;
        if (totalDelivery > 0) {
            deliveryStatus = "✓ Regular deliveries received - Stock replenishment active";
        } else {
            deliveryStatus = "⚠️ No deliveries in period - Check supply chain";
        }
        insights.put("deliveryStatus", deliveryStatus);

        // 6. Summary Insight
        String summary = String.format(
            "🤖 AI STOCK ANALYSIS: Current stock: %.0f units. %s " +
            "Average daily consumption: %.2f units. At this rate, stock will %s in %.1f days. " +
            "Consumption pattern: %s (Variance: %.1f%%). " +
            "🔔 REORDER ACTION: %s. " +
            "Stock trend: %s. %s",
            currentStock,
            healthEmoji + " " + healthStatus,
            avgDailyConsumption,
            daysUntilEmpty < Double.MAX_VALUE ? "last" : "remain indefinite",
            daysUntilEmpty < Double.MAX_VALUE ? daysUntilEmpty : 0,
            consumptionPattern,
            variancePercent,
            reorderUrgency,
            stockTrend,
            deliveryStatus
        );
        insights.put("summary", summary);

        return insights;
    }
}
