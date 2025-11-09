package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.entity.SalaryRecord;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import com.ro.petrol_pump_ai.repository.SalaryRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RevenueVsExpenseReportService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    @Autowired
    private SalaryRecordRepository salaryRecordRepository;

    public Map<String, Object> generateRevenueVsExpenseReport(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> dailyEntries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);
        List<SalaryRecord> salaryRecords = salaryRecordRepository.findAll();

        Map<String, Object> report = new HashMap<>();

        // ===== REVENUE ANALYSIS =====
        double totalRevenue = dailyEntries.stream()
            .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
            .sum();
        double avgDailyRevenue = dailyEntries.size() > 0 ? totalRevenue / dailyEntries.size() : 0;

        // ===== EXPENSE ANALYSIS =====
        double totalSalaryExpense = salaryRecords.stream()
            .mapToDouble(s -> s.getNetSalary() != null ? s.getNetSalary() : 0)
            .sum();

        // Estimate other expenses (could be 10-15% of revenue for operational costs)
        double estimatedOtherExpenses = totalRevenue * 0.12; // 12% operational cost assumption
        double totalExpense = totalSalaryExpense + estimatedOtherExpenses;

        report.put("totalRevenue", totalRevenue);
        report.put("avgDailyRevenue", avgDailyRevenue);
        report.put("totalSalaryExpense", totalSalaryExpense);
        report.put("estimatedOtherExpenses", estimatedOtherExpenses);
        report.put("totalExpense", totalExpense);

        // ===== PROFITABILITY =====
        double netProfit = totalRevenue - totalExpense;
        double profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
        double expenseToRevenueRatio = totalRevenue > 0 ? (totalExpense / totalRevenue) * 100 : 0;

        report.put("netProfit", netProfit);
        report.put("profitMargin", profitMargin);
        report.put("expenseToRevenueRatio", expenseToRevenueRatio);

        // ===== EXPENSE BREAKDOWN =====
        double salaryPercentage = totalExpense > 0 ? (totalSalaryExpense / totalExpense) * 100 : 0;
        double otherExpensePercentage = totalExpense > 0 ? (estimatedOtherExpenses / totalExpense) * 100 : 0;

        List<Map<String, Object>> expenseBreakdown = new ArrayList<>();
        expenseBreakdown.add(Map.of(
            "category", "Salary & Payroll",
            "amount", totalSalaryExpense,
            "percentage", salaryPercentage
        ));
        expenseBreakdown.add(Map.of(
            "category", "Operational Costs",
            "amount", estimatedOtherExpenses,
            "percentage", otherExpensePercentage
        ));
        report.put("expenseBreakdown", expenseBreakdown);

        // ===== DAILY PERFORMANCE DATA =====
        List<Map<String, Object>> dailyPerformance = new ArrayList<>();
        for (int i = 0; i < dailyEntries.size(); i++) {
            DailyEntry entry = dailyEntries.get(i);
            double dailyExpenseProration = totalExpense / dailyEntries.size();

            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", entry.getEntryDate().toString());
            dayData.put("dateLabel", entry.getEntryDate().getDayOfMonth() + "/" + entry.getEntryDate().getMonthValue());
            dayData.put("revenue", entry.getDailyRevenue() != null ? entry.getDailyRevenue() : 0);
            dayData.put("expense", dailyExpenseProration);
            dayData.put("profit", (entry.getDailyRevenue() != null ? entry.getDailyRevenue() : 0) - dailyExpenseProration);
            dailyPerformance.add(dayData);
        }
        report.put("dailyPerformance", dailyPerformance);

        // ===== COMPARISON DATA FOR PIE CHART =====
        List<Map<String, Object>> comparisonData = new ArrayList<>();
        comparisonData.add(Map.of("category", "Net Profit", "amount", Math.max(netProfit, 0)));
        comparisonData.add(Map.of("category", "Total Expense", "amount", totalExpense));
        report.put("comparisonData", comparisonData);

        // ===== FINANCIAL METRICS =====
        double breakEvenRevenue = totalExpense; // Revenue needed to break even
        double profitPerEmployee = salaryRecords.size() > 0 ? netProfit / salaryRecords.size() : 0;
        double revenuePerEmployee = salaryRecords.size() > 0 ? totalRevenue / salaryRecords.size() : 0;

        report.put("breakEvenRevenue", breakEvenRevenue);
        report.put("profitPerEmployee", profitPerEmployee);
        report.put("revenuePerEmployee", revenuePerEmployee);

        // ===== EFFICIENCY METRICS =====
        double operationalEfficiency = totalRevenue > 0 ? ((totalRevenue - totalExpense) / totalRevenue) * 100 : 0;
        int workingDays = dailyEntries.size();

        report.put("operationalEfficiency", operationalEfficiency);
        report.put("workingDays", workingDays);

        // ===== ENHANCED AI INSIGHTS =====
        report.put("aiInsights", generateEnhancedAIInsights(
            totalRevenue, totalExpense, netProfit, profitMargin,
            avgDailyRevenue, totalSalaryExpense, estimatedOtherExpenses,
            expenseToRevenueRatio, operationalEfficiency, salaryRecords.size()
        ));

        return report;
    }

    private Map<String, Object> generateEnhancedAIInsights(
            double totalRevenue, double totalExpense, double netProfit, double profitMargin,
            double avgDailyRevenue, double totalSalaryExpense, double otherExpenses,
            double expenseToRevenueRatio, double operationalEfficiency, int employeeCount) {

        Map<String, Object> insights = new HashMap<>();

        // 1. Financial Health Status
        String healthStatus;
        String healthEmoji;
        if (profitMargin > 30) {
            healthStatus = "Excellent - Highly Profitable";
            healthEmoji = "";
        } else if (profitMargin > 15) {
            healthStatus = "Good - Profitable Business";
            healthEmoji = "";
        } else if (profitMargin > 5) {
            healthStatus = "Fair - Modest Profitability";
            healthEmoji = "";
        } else if (profitMargin > 0) {
            healthStatus = "Concerning - Low Profit Margin";
            healthEmoji = "";
        } else {
            healthStatus = "Critical - Operating at Loss";
            healthEmoji = "";
        }
        insights.put("healthStatus", healthStatus);
        insights.put("healthEmoji", healthEmoji);

        // 2. Expense Control Assessment
        String expenseControl;
        if (expenseToRevenueRatio < 40) {
            expenseControl = "Excellent Control - Expenses well managed";
        } else if (expenseToRevenueRatio < 60) {
            expenseControl = "Good Control - Balanced expense structure";
        } else if (expenseToRevenueRatio < 75) {
            expenseControl = "Fair Control - Needs optimization";
        } else {
            expenseControl = "Poor Control - Urgent cost reduction needed";
        }
        insights.put("expenseControl", expenseControl);

        // 3. Salary Burden Analysis
        double salaryBurden = totalRevenue > 0 ? (totalSalaryExpense / totalRevenue) * 100 : 0;
        String salaryBurdenStatus;
        if (salaryBurden < 30) {
            salaryBurdenStatus = "Optimal - Salary efficient";
        } else if (salaryBurden < 50) {
            salaryBurdenStatus = "Acceptable - Within industry norms";
        } else {
            salaryBurdenStatus = "High - Consider workforce optimization";
        }
        insights.put("salaryBurdenStatus", salaryBurdenStatus);
        insights.put("salaryBurdenPercent", salaryBurden);

        // 4. Recommendations
        String recommendations = "";
        if (profitMargin < 10) {
            recommendations += "Reduce operational costs or increase revenue. ";
        }
        if (salaryBurden > 50) {
            recommendations += "Review workforce efficiency. ";
        }
        if (totalExpense > totalRevenue * 0.8) {
            recommendations += "Expenses are consuming most revenue - implement cost control. ";
        }
        if (recommendations.isEmpty()) {
            recommendations = "Financial position is healthy - maintain current strategy.";
        }
        insights.put("recommendations", recommendations);

        // 5. Growth Potential
        String growthPotential;
        if (profitMargin > 20 && operationalEfficiency > 70) {
            growthPotential = "High - Ready for expansion";
        } else if (profitMargin > 10 && operationalEfficiency > 50) {
            growthPotential = "Moderate - Optimize operations first";
        } else {
            growthPotential = "Low - Focus on profitability improvement";
        }
        insights.put("growthPotential", growthPotential);

        // 6. Summary Insight
        String summary = String.format(
            "AI FINANCIAL ANALYSIS: %s %s " +
            "Total Revenue: ₹%.0f (Avg daily: ₹%.0f). Total Expense: ₹%.0f. " +
            "Net Profit: ₹%.0f (Margin: %.1f%%). " +
            "Salary Burden: %.1f%% (%s). %s " +
            "Expense Breakdown: Salary ₹%.0f (%.1f%%) + Operations ₹%.0f (%.1f%%). " +
            "Analysis: %s " +
            "Growth Potential: %s. Employees: %d.",
            healthEmoji,
            healthStatus,
            totalRevenue,
            avgDailyRevenue,
            totalExpense,
            netProfit,
            profitMargin,
            salaryBurden,
            salaryBurdenStatus,
            expenseControl,
            totalSalaryExpense,
            (totalSalaryExpense / totalExpense) * 100,
            otherExpenses,
            (otherExpenses / totalExpense) * 100,
            recommendations,
            growthPotential,
            employeeCount
        );
        insights.put("summary", summary);

        return insights;
    }
}
