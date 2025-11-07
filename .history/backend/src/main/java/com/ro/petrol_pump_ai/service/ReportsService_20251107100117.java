package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.*;
import com.ro.petrol_pump_ai.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportsService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private SalaryRecordRepository salaryRecordRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private ChallanRepository challanRepository;
    
    @Autowired
    private AIExtractorService aiExtractorService;

    // ========== OPERATIONAL REPORTS ==========

    public Map<String, Object> getDailySalesReport(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);
        
        Map<String, Object> report = new HashMap<>();
        
        // Calculate metrics
        double totalRevenue = entries.stream().mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).sum();
        double totalSales = entries.stream().mapToDouble(e -> e.getSalesToday() != null ? e.getSalesToday() : 0).sum();
        double avgPricePerLiter = entries.stream().mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0).average().orElse(0);
        
        report.put("totalRevenue", totalRevenue);
        report.put("totalSales", totalSales);
        report.put("avgPricePerLiter", avgPricePerLiter);
        report.put("transactionCount", entries.size());
        
        // Daily breakdown for chart
        List<Map<String, Object>> dailyData = entries.stream().map(e -> {
            Map<String, Object> day = new HashMap<>();
            day.put("date", e.getEntryDate());
            day.put("revenue", e.getDailyRevenue());
            day.put("sales", e.getSalesToday());
            return day;
        }).collect(Collectors.toList());
        
        report.put("dailyData", dailyData);
        
        // AI Insight
        String aiInsight = generateSalesInsight(entries, totalRevenue, totalSales);
        report.put("aiInsight", aiInsight);
        
        return report;
    }

    public Map<String, Object> getMonthlyPerformanceReport(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        List<DailyEntry> currentMonthEntries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);
        
        // Previous month
        LocalDate prevStart = startDate.minusMonths(1);
        LocalDate prevEnd = prevStart.plusMonths(1).minusDays(1);
        List<DailyEntry> prevMonthEntries = dailyEntryRepository.findByEntryDateBetween(prevStart, prevEnd);
        
        Map<String, Object> report = new HashMap<>();
        
        double currentMonthRevenue = currentMonthEntries.stream().mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).sum();
        double prevMonthRevenue = prevMonthEntries.stream().mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).sum();
        
        double growthPercentage = prevMonthRevenue > 0 ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;
        
        report.put("currentMonthRevenue", currentMonthRevenue);
        report.put("previousMonthRevenue", prevMonthRevenue);
        report.put("growthPercentage", growthPercentage);
        report.put("bestDay", currentMonthEntries.stream().max(Comparator.comparing(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)));
        report.put("worstDay", currentMonthEntries.stream().min(Comparator.comparing(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)));
        
        // AI Prediction for next month
        String prediction = predictNextMonthRevenue(currentMonthRevenue, prevMonthRevenue);
        report.put("aiPrediction", prediction);
        
        return report;
    }

    public Map<String, Object> getStockMovementReport(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);
        
        Map<String, Object> report = new HashMap<>();
        
        // Stock data for chart
        List<Map<String, Object>> stockData = entries.stream().map(e -> {
            Map<String, Object> day = new HashMap<>();
            day.put("date", e.getEntryDate());
            day.put("openingStock", e.getOpeningStock());
            day.put("closingStock", e.getClosingStock());
            day.put("consumption", e.getOpeningStock() - e.getClosingStock());
            return day;
        }).collect(Collectors.toList());
        
        report.put("stockData", stockData);
        
        // Average consumption rate
        double avgConsumption = entries.stream()
            .mapToDouble(e -> (e.getOpeningStock() - e.getClosingStock()))
            .average().orElse(0);
        report.put("avgDailyConsumption", avgConsumption);
        
        // Last closing stock
        Optional<DailyEntry> lastEntry = entries.stream().max(Comparator.comparing(DailyEntry::getEntryDate));
        if (lastEntry.isPresent()) {
            double daysUntilEmpty = lastEntry.get().getClosingStock() / avgConsumption;
            report.put("estimatedDaysUntilStockEmpty", daysUntilEmpty);
            report.put("aiAlert", daysUntilEmpty < 5 ? "⚠️ REORDER IMMEDIATELY - Stock will finish in " + (int)daysUntilEmpty + " days" : "✓ Stock level optimal");
        }
        
        return report;
    }

    public Map<String, Object> getPriceTrendReport(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);
        
        Map<String, Object> report = new HashMap<>();
        
        List<Map<String, Object>> priceData = entries.stream().map(e -> {
            Map<String, Object> day = new HashMap<>();
            day.put("date", e.getEntryDate());
            day.put("pricePerLiter", e.getPricePerUnit());
            day.put("salesVolume", e.getSalesToday());
            return day;
        }).collect(Collectors.toList());
        
        report.put("priceData", priceData);
        
        // Price volatility
        double avgPrice = entries.stream().mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0).average().orElse(0);
        double maxPrice = entries.stream().mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0).max().orElse(0);
        double minPrice = entries.stream().mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0).min().orElse(0);
        double volatility = ((maxPrice - minPrice) / avgPrice) * 100;
        
        report.put("avgPrice", avgPrice);
        report.put("maxPrice", maxPrice);
        report.put("minPrice", minPrice);
        report.put("volatility", volatility);
        
        // AI Insight on elasticity
        String elasticityInsight = analyzeElasticity(entries);
        report.put("aiElasticityInsight", elasticityInsight);
        
        return report;
    }

    // ========== FINANCIAL REPORTS ==========

    public Map<String, Object> getRevenueVsExpenseReport(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> dailyEntries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);
        List<SalaryRecord> salaryRecords = salaryRecordRepository.findAll(); // Filter by date range
        
        Map<String, Object> report = new HashMap<>();
        
        double totalRevenue = dailyEntries.stream().mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).sum();
        double totalSalaryExpense = salaryRecords.stream().mapToDouble(s -> s.getNetSalary() != null ? s.getNetSalary() : 0).sum();
        
        double netProfit = totalRevenue - totalSalaryExpense;
        double profitMargin = (netProfit / totalRevenue) * 100;
        
        report.put("totalRevenue", totalRevenue);
        report.put("totalExpense", totalSalaryExpense);
        report.put("netProfit", netProfit);
        report.put("profitMargin", profitMargin);
        
        // Chart data
        List<Map<String, Object>> comparisonData = new ArrayList<>();
        Map<String, Object> revenueItem = new HashMap<>();
        revenueItem.put("category", "Revenue");
        revenueItem.put("amount", totalRevenue);
        comparisonData.add(revenueItem);
        
        Map<String, Object> expenseItem = new HashMap<>();
        expenseItem.put("category", "Salary Expense");
        expenseItem.put("amount", totalSalaryExpense);
        comparisonData.add(expenseItem);
        
        report.put("comparisonData", comparisonData);
        
        // AI Insight
        String insight = generateFinancialInsight(totalRevenue, totalSalaryExpense, profitMargin);
        report.put("aiInsight", insight);
        
        return report;
    }

    public Map<String, Object> getMonthlyPandLReport(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);
        
        Map<String, Object> report = new HashMap<>();
        
        double totalRevenue = entries.stream().mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).sum();
        double totalExpense = entries.stream().mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).sum() * 0.20; // Assume 20% operating cost
        double netProfit = totalRevenue - totalExpense;
        
        report.put("month", year + "-" + month);
        report.put("revenue", totalRevenue);
        report.put("expense", totalExpense);
        report.put("profit", netProfit);
        report.put("profitMargin", (netProfit / totalRevenue) * 100);
        
        return report;
    }

    // ========== EMPLOYEE REPORTS ==========

    public Map<String, Object> getEmployeeAttendanceReport(LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByAttendanceDateBetween(startDate, endDate);
        List<Employee> employees = employeeRepository.findAll();
        
        Map<String, Object> report = new HashMap<>();
        
        List<Map<String, Object>> employeeData = employees.stream().map(emp -> {
            List<Attendance> empAttendance = attendances.stream()
                .filter(a -> a.getEmployeeId().equals(emp.getId()))
                .collect(Collectors.toList());
            
            long presentDays = empAttendance.stream().filter(a -> "Present".equals(a.getStatus())).count();
            long absentDays = empAttendance.stream().filter(a -> "Absent".equals(a.getStatus())).count();
            long leaveDays = empAttendance.stream().filter(a -> "Leave".equals(a.getStatus())).count();
            
            double attendancePercentage = empAttendance.size() > 0 ? (presentDays * 100.0 / empAttendance.size()) : 0;
            
            Map<String, Object> data = new HashMap<>();
            data.put("employeeName", emp.getName());
            data.put("presentDays", presentDays);
            data.put("absentDays", absentDays);
            data.put("leaveDays", leaveDays);
            data.put("attendancePercentage", attendancePercentage);
            
            return data;
        }).collect(Collectors.toList());
        
        report.put("employeeAttendanceData", employeeData);
        
        // AI Alert
        String alert = generateAttendanceAlert(employeeData);
        report.put("aiAlert", alert);
        
        return report;
    }

    public Map<String, Object> getPayrollReport() {
        List<SalaryRecord> records = salaryRecordRepository.findAll();
        
        Map<String, Object> report = new HashMap<>();
        
        double totalSalary = records.stream().mapToDouble(s -> s.getNetSalary() != null ? s.getNetSalary() : 0).sum();
        long pendingCount = records.stream().filter(s -> "Pending".equals(s.getStatus())).count();
        
        List<Map<String, Object>> salaryData = records.stream().map(s -> {
            Map<String, Object> data = new HashMap<>();
            data.put("employeeId", s.getEmployeeId());
            data.put("baseSalary", s.getBaseSalary());
            data.put("netSalary", s.getNetSalary());
            data.put("status", s.getStatus());
            data.put("paymentMethod", s.getPaymentMethod());
            return data;
        }).collect(Collectors.toList());
        
        report.put("totalSalary", totalSalary);
        report.put("pendingPayments", pendingCount);
        report.put("salaryData", salaryData);
        
        if (pendingCount > 0) {
            report.put("aiAlert", "⚠️ " + pendingCount + " pending salary payments. Process immediately!");
        }
        
        return report;
    }

    // ========== AI HELPER METHODS ==========

    private String generateSalesInsight(List<DailyEntry> entries, double totalRevenue, double totalSales) {
        // This will call Gemini AI to generate insight
        String prompt = String.format(
            "Analyze this petrol pump sales data:\n" +
            "Total Revenue: ₹%,.2f\n" +
            "Total Sales: %.2f liters\n" +
            "Days: %d\n" +
            "Average daily revenue: ₹%,.2f\n" +
            "Provide a brief 1-2 line insight.", 
            totalRevenue, totalSales, entries.size(), totalRevenue / entries.size()
        );
        
        // Call Gemini API
        return callGeminiAI(prompt);
    }

    private String predictNextMonthRevenue(double currentMonth, double previousMonth) {
        String prompt = String.format(
            "Given current month revenue: ₹%,.2f and previous month: ₹%,.2f, predict next month revenue with percentage change.",
            currentMonth, previousMonth
        );
        return callGeminiAI(prompt);
    }

    private String analyzeElasticity(List<DailyEntry> entries) {
        String prompt = "Analyze price elasticity from this data: " + entries.toString() + ". Provide insight in 1-2 lines.";
        return callGeminiAI(prompt);
    }

    private String generateFinancialInsight(double revenue, double expense, double margin) {
        String prompt = String.format(
            "Given Revenue: ₹%,.2f, Expense: ₹%,.2f, Profit Margin: %.2f%%, provide financial insight.",
            revenue, expense, margin
        );
        return callGeminiAI(prompt);
    }

    public Map<String, Object> getDailySalesReport(LocalDate startDate, LocalDate endDate) {
        // Fetch last 7 days of data
        LocalDate adjustedStartDate = endDate.minusDays(6); // Last 7 days
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(adjustedStartDate, endDate);
        
        Map<String, Object> report = new HashMap<>();
        
        // ===== SUMMARY METRICS =====
        double totalRevenue = entries.stream()
            .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
            .sum();
        double totalSales = entries.stream()
            .mapToDouble(e -> e.getSalesToday() != null ? e.getSalesToday() : 0)
            .sum();
        double avgPricePerLiter = entries.stream()
            .mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0)
            .average().orElse(0);
        
        report.put("totalRevenue", totalRevenue);
        report.put("totalSales", totalSales);
        report.put("avgPricePerLiter", avgPricePerLiter);
        report.put("transactionCount", entries.size());
        
        // ===== LINE CHART DATA (Daily Trend) =====
        // Sort by date and ensure 7-day continuous data
        List<Map<String, Object>> dailyTrendData = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = endDate.minusDays(i);
            Optional<DailyEntry> entryOpt = entries.stream()
                .filter(e -> e.getEntryDate().equals(date))
                .findFirst();
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.toString());
            dayData.put("revenue", entryOpt.map(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).orElse(0.0));
            dayData.put("quantity", entryOpt.map(e -> e.getSalesToday() != null ? e.getSalesToday() : 0).orElse(0.0));
            dayData.put("price", entryOpt.map(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0).orElse(0.0));
            dailyTrendData.add(dayData);
        }
        report.put("dailyTrendData", dailyTrendData);
        
        // ===== BAR CHART DATA (Product-wise breakdown) =====
        // Group sales by product (assuming we track product_id in daily_entries)
        Map<Long, Map<String, Object>> productMap = new HashMap<>();
        
        for (DailyEntry entry : entries) {
            Long productId = entry.getProductId();
            if (productId == null) continue;
            
            productMap.putIfAbsent(productId, new HashMap<>());
            Map<String, Object> productData = productMap.get(productId);
            
            double currentQuantity = (double) productData.getOrDefault("totalQuantity", 0.0);
            double currentRevenue = (double) productData.getOrDefault("totalRevenue", 0.0);
            
            productData.put("totalQuantity", currentQuantity + (entry.getSalesToday() != null ? entry.getSalesToday() : 0));
            productData.put("totalRevenue", currentRevenue + (entry.getDailyRevenue() != null ? entry.getDailyRevenue() : 0));
            productData.put("productId", productId);
        }
        
        List<Map<String, Object>> productBreakdown = new ArrayList<>(productMap.values());
        report.put("productBreakdown", productBreakdown);
        
        // ===== PIE CHART DATA (Product-wise sales share) =====
        List<Map<String, Object>> productPieData = productBreakdown.stream()
            .map(p -> {
                Map<String, Object> pie = new HashMap<>();
                pie.put("name", "Product " + p.get("productId")); // Will replace with actual product name
                pie.put("value", p.get("totalQuantity"));
                pie.put("revenue", p.get("totalRevenue"));
                return pie;
            })
            .collect(Collectors.toList());
        report.put("productPieData", productPieData);
        
        // ===== AI INSIGHT =====
        String insight = String.format(
            "📈 Last 7 days: ₹%.0f revenue, %.0f liters sold, ₹%.2f avg price/liter. Top day: %s",
            totalRevenue, totalSales, avgPricePerLiter,
            dailyTrendData.stream()
                .max(Comparator.comparing(m -> (double) m.get("revenue")))
                .map(m -> m.get("date"))
                .orElse("N/A")
        );
        report.put("aiInsight", insight);
        
        return report;
    }
    

    private String generateAttendanceAlert(List<Map<String, Object>> employeeData) {
        long lowAttendance = employeeData.stream()
            .filter(e -> (Double) e.get("attendancePercentage") < 80)
            .count();
        
        if (lowAttendance > 0) {
            return "⚠️ " + lowAttendance + " employees have attendance below 80%";
        }
        return "✓ All employees have good attendance";
    }

    private String callGeminiAI(String prompt) {
        // Call your existing AIExtractorService or create new method
        // For now, return placeholder
        return "AI Analysis: " + prompt.substring(0, Math.min(50, prompt.length())) + "...";
    }
}
