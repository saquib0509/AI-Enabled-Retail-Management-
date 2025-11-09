package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MonthlyPerformanceReportService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    public Map<String, Object> generateMonthlyPerformanceReport(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        // Current month data
        List<DailyEntry> currentMonthEntries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);

        // Previous month data
        LocalDate prevStart = startDate.minusMonths(1);
        LocalDate prevEnd = prevStart.plusMonths(1).minusDays(1);
        List<DailyEntry> prevMonthEntries = dailyEntryRepository.findByEntryDateBetween(prevStart, prevEnd);

        // Previous year same month
        LocalDate yearAgoStart = startDate.minusYears(1);
        LocalDate yearAgoEnd = yearAgoStart.plusMonths(1).minusDays(1);
        List<DailyEntry> yearAgoEntries = dailyEntryRepository.findByEntryDateBetween(yearAgoStart, yearAgoEnd);

        Map<String, Object> report = new HashMap<>();

        // ===== MONTHLY METRICS =====
        double currentRevenue = currentMonthEntries.stream()
            .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
            .sum();
        double prevRevenue = prevMonthEntries.stream()
            .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
            .sum();
        double yearAgoRevenue = yearAgoEntries.stream()
            .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
            .sum();

        double currentSales = currentMonthEntries.stream()
            .mapToDouble(e -> e.getSalesToday() != null ? e.getSalesToday() : 0)
            .sum();
        double prevSales = prevMonthEntries.stream()
            .mapToDouble(e -> e.getSalesToday() != null ? e.getSalesToday() : 0)
            .sum();
        double yearAgoSales = yearAgoEntries.stream()
            .mapToDouble(e -> e.getSalesToday() != null ? e.getSalesToday() : 0)
            .sum();

        report.put("currentMonthRevenue", currentRevenue);
        report.put("previousMonthRevenue", prevRevenue);
        report.put("yearAgoRevenue", yearAgoRevenue);

        // ===== GROWTH CALCULATIONS =====
        double monthOnMonthGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        double yearOnYearGrowth = yearAgoRevenue > 0 ? ((currentRevenue - yearAgoRevenue) / yearAgoRevenue) * 100 : 0;

        report.put("monthOnMonthGrowth", monthOnMonthGrowth);
        report.put("yearOnYearGrowth", yearOnYearGrowth);

        // ===== DAILY DATA FOR LINE CHART =====
        List<Map<String, Object>> dailyPerformance = new ArrayList<>();
        for (int day = 1; day <= endDate.getDayOfMonth(); day++) {
            LocalDate date = LocalDate.of(year, month, day);
            Optional<DailyEntry> entryOpt = currentMonthEntries.stream()
                .filter(e -> e.getEntryDate().equals(date))
                .findFirst();

            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", day);
            dayData.put("revenue", entryOpt.map(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).orElse(0.0));
            dayData.put("quantity", entryOpt.map(e -> e.getSalesToday() != null ? e.getSalesToday() : 0).orElse(0.0));
            dailyPerformance.add(dayData);
        }
        report.put("dailyPerformance", dailyPerformance);

        // ===== COMPARISON DATA FOR MULTI-MONTH CHART =====
        List<Map<String, Object>> monthlyComparison = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate comparisonStart = startDate.minusMonths(i);
            LocalDate comparisonEnd = comparisonStart.plusMonths(1).minusDays(1);
            List<DailyEntry> comparisonEntries = dailyEntryRepository.findByEntryDateBetween(comparisonStart, comparisonEnd);

            double compRevenue = comparisonEntries.stream()
                .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
                .sum();
            double compSales = comparisonEntries.stream()
                .mapToDouble(e -> e.getSalesToday() != null ? e.getSalesToday() : 0)
                .sum();

            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", comparisonStart.getMonthValue() + "/" + comparisonStart.getYear());
            monthData.put("revenue", compRevenue);
            monthData.put("sales", compSales);
            monthlyComparison.add(monthData);
        }
        report.put("monthlyComparison", monthlyComparison);

        // ===== BEST & WORST DAYS =====
        Optional<DailyEntry> bestDay = currentMonthEntries.stream()
            .max(Comparator.comparing(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0));
        Optional<DailyEntry> worstDay = currentMonthEntries.stream()
            .min(Comparator.comparing(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0));

        report.put("bestDay", bestDay.map(e -> Map.of(
            "date", e.getEntryDate(),
            "revenue", e.getDailyRevenue()
        )).orElse(null));
        report.put("worstDay", worstDay.map(e -> Map.of(
            "date", e.getEntryDate(),
            "revenue", e.getDailyRevenue()
        )).orElse(null));

        // ===== AVERAGE METRICS =====
        double avgDailyRevenue = currentMonthEntries.size() > 0 ? currentRevenue / currentMonthEntries.size() : 0;
        double avgDailySales = currentMonthEntries.size() > 0 ? currentSales / currentMonthEntries.size() : 0;

        report.put("avgDailyRevenue", avgDailyRevenue);
        report.put("avgDailySales", avgDailySales);

        // ===== ENHANCED AI INSIGHTS =====
        report.put("aiInsights", generateEnhancedAIInsights(
            currentRevenue, prevRevenue, yearAgoRevenue,
            currentSales, prevSales, yearAgoSales,
            monthOnMonthGrowth, yearOnYearGrowth,
            bestDay, worstDay, avgDailyRevenue,
            year, month, currentMonthEntries.size()
        ));

        return report;
    }

    private Map<String, Object> generateEnhancedAIInsights(
            double currentRevenue, double prevRevenue, double yearAgoRevenue,
            double currentSales, double prevSales, double yearAgoSales,
            double momGrowth, double yoyGrowth,
            Optional<?> bestDay, Optional<?> worstDay, double avgDailyRevenue,
            int year, int month, int workingDays) {

        Map<String, Object> insights = new HashMap<>();

        // 1. Growth Trend Analysis
        String growthTrend;
        String trendEmoji;
        if (momGrowth > 20) {
            growthTrend = "Exceptional Growth";
            trendEmoji = "";
        } else if (momGrowth > 10) {
            growthTrend = "Strong Growth";
            trendEmoji = "";
        } else if (momGrowth > 0) {
            growthTrend = "Positive Growth";
            trendEmoji = "";
        } else if (momGrowth > -10) {
            growthTrend = "Slight Decline";
            trendEmoji = "";
        } else {
            growthTrend = "Significant Decline";
            trendEmoji = "";
        }
        insights.put("growthTrend", growthTrend);
        insights.put("trendEmoji", trendEmoji);

        // 2. Year-over-Year Performance
        String yoyPerformance = yoyGrowth > 0
            ? String.format("UP %.1f%% YoY", yoyGrowth)
            : String.format("DOWN %.1f%% YoY", Math.abs(yoyGrowth));
        insights.put("yoyPerformance", yoyPerformance);

        // 3. Revenue Health Score
        double healthScore = 0;
        if (momGrowth > 0) healthScore += 30;
        if (yoyGrowth > 0) healthScore += 30;
        if (avgDailyRevenue > prevRevenue / 30) healthScore += 20;
        if (workingDays >= 20) healthScore += 20;

        String healthStatus;
        if (healthScore >= 80) {
            healthStatus = "Excellent";
        } else if (healthScore >= 60) {
            healthStatus = "Good";
        } else if (healthScore >= 40) {
            healthStatus = "Fair";
        } else {
            healthStatus = "Needs Attention";
        }
        insights.put("healthScore", healthScore);
        insights.put("healthStatus", healthStatus);

        // 4. Projected Performance
        double projectedMonthlyRevenue = avgDailyRevenue * 30;
        insights.put("projectedMonthlyRevenue", projectedMonthlyRevenue);

        // 5. Summary Insight
        String summary = String.format(
            "🤖 AI ANALYSIS: %s %s - Your business achieved ₹%.0f revenue this month with %s performance. " +
            "Month-on-month growth: %s%.1f%%. Year-over-year comparison: %s. " +
            "Average daily revenue: ₹%.0f. Health Score: %.0f/100 (%s). " +
            "At current pace, projected monthly target: ₹%.0f.",
            trendEmoji, month + "/" + year,
            currentRevenue,
            healthStatus,
            momGrowth >= 0 ? "+" : "",
            momGrowth,
            yoyPerformance,
            avgDailyRevenue,
            healthScore,
            healthStatus,
            projectedMonthlyRevenue
        );
        insights.put("summary", summary);

        return insights;
    }
}
