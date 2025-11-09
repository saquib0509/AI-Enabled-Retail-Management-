package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.entity.Attendance;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import com.ro.petrol_pump_ai.repository.EmployeeRepository;
import com.ro.petrol_pump_ai.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    public Map<String, Object> getDashboardData() {
        Map<String, Object> dashboard = new HashMap<>();
        LocalDate today = LocalDate.now();

        // ===== TODAY'S DATA =====
        // FIX: Use findByEntryDate which returns List, then get the first one
        List<DailyEntry> todayEntries = dailyEntryRepository.findByEntryDateBetween(today, today);
        Optional<DailyEntry> todayEntry = todayEntries.stream().findFirst();
        
        double todayRevenue = todayEntry.map(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).orElse(0.0);
        double todayQuantity = todayEntry.map(e -> e.getSalesToday() != null ? e.getSalesToday() : 0).orElse(0.0);
        double todayStock = todayEntry.map(e -> e.getClosingStock() != null ? e.getClosingStock() : 0).orElse(0.0);

        // Yesterday's data
        List<DailyEntry> yesterdayEntries = dailyEntryRepository.findByEntryDateBetween(today.minusDays(1), today.minusDays(1));
        Optional<DailyEntry> yesterdayEntry = yesterdayEntries.stream().findFirst();
        double yesterdayRevenue = yesterdayEntry.map(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).orElse(0.0);

        // ===== TODAY METRICS =====
        dashboard.put("todayRevenue", todayRevenue);
        dashboard.put("todayQuantity", todayQuantity);
        dashboard.put("todayStock", todayStock);
        dashboard.put("revenueVsYesterday", yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0);

        // ===== LAST 7 DAYS =====
        List<DailyEntry> last7Days = dailyEntryRepository.findByEntryDateBetween(today.minusDays(6), today);
        double revenue7Days = last7Days.stream().mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0).sum();
        double avgDaily7Days = last7Days.size() > 0 ? revenue7Days / last7Days.size() : 0;
        
        // Top product last 7 days
        String topProduct = last7Days.stream()
            .filter(e -> e.getProduct() != null)
            .collect(Collectors.groupingBy(e -> e.getProduct().getName(), Collectors.summingDouble(e -> e.getSalesToday() != null ? e.getSalesToday() : 0)))
            .entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("N/A");

        dashboard.put("revenue7Days", revenue7Days);
        dashboard.put("avgDaily7Days", avgDaily7Days);
        dashboard.put("topProduct7Days", topProduct);

        // ===== ATTENDANCE TODAY =====
        List<Attendance> todayAttendance = attendanceRepository.findByAttendanceDate(today);
        long presentToday = todayAttendance.stream().filter(a -> "Present".equalsIgnoreCase(a.getStatus())).count();
        long totalEmployees = employeeRepository.count();
        double attendancePercent = totalEmployees > 0 ? (presentToday * 100.0 / totalEmployees) : 0;

        dashboard.put("attendanceToday", attendancePercent);
        dashboard.put("presentToday", presentToday);
        dashboard.put("totalEmployees", totalEmployees);

        // ===== STOCK ALERTS =====
        List<Map<String, Object>> stockAlerts = generateStockAlerts(last7Days);
        dashboard.put("stockAlerts", stockAlerts);

        // ===== CRITICAL ALERTS =====
        List<String> criticalAlerts = generateCriticalAlerts(todayRevenue, yesterdayRevenue, attendancePercent, todayStock);
        dashboard.put("criticalAlerts", criticalAlerts);

        // ===== AI DAILY BRIEF =====
        String aiBrief = generateAIBrief(todayRevenue, yesterdayRevenue, attendancePercent, topProduct, stockAlerts.size());
        dashboard.put("aiBrief", aiBrief);

        // ===== RECOMMENDATIONS =====
        List<String> recommendations = generateRecommendations(todayRevenue, yesterdayRevenue, attendancePercent, stockAlerts);
        dashboard.put("recommendations", recommendations);

        return dashboard;
    }

    private List<Map<String, Object>> generateStockAlerts(List<DailyEntry> last7Days) {
        List<Map<String, Object>> alerts = new ArrayList<>();

        // Group by product and calculate avg consumption
        Map<String, List<DailyEntry>> byProduct = last7Days.stream()
            .filter(e -> e.getProduct() != null)
            .collect(Collectors.groupingBy(e -> e.getProduct().getName()));

        for (Map.Entry<String, List<DailyEntry>> entry : byProduct.entrySet()) {
            List<DailyEntry> productEntries = entry.getValue();
            Optional<DailyEntry> lastEntry = productEntries.stream()
                .max(Comparator.comparing(DailyEntry::getEntryDate));

            if (lastEntry.isPresent()) {
                DailyEntry last = lastEntry.get();
                double avgConsumption = productEntries.stream()
                    .mapToDouble(e -> e.getOpeningStock() != null && e.getClosingStock() != null ? 
                        (e.getOpeningStock() - e.getClosingStock()) : 0)
                    .average().orElse(0);

                double daysUntilEmpty = avgConsumption > 0 ? last.getClosingStock() / avgConsumption : Double.MAX_VALUE;

                String status;
                String emoji;
                if (daysUntilEmpty < 1) {
                    status = "CRITICAL";
                    emoji = "";
                } else if (daysUntilEmpty < 3) {
                    status = "WARNING";
                    emoji = "";
                } else if (daysUntilEmpty < 7) {
                    status = "LOW";
                    emoji = "";
                } else {
                    status = "OK";
                    emoji = "";
                }

                Map<String, Object> alert = new HashMap<>();
                alert.put("product", entry.getKey());
                alert.put("status", status);
                alert.put("emoji", emoji);
                alert.put("daysUntilEmpty", daysUntilEmpty < 1000 ? daysUntilEmpty : "∞");
                alert.put("currentStock", last.getClosingStock());
                alerts.add(alert);
            }
        }

        return alerts;
    }

    private List<String> generateCriticalAlerts(double todayRevenue, double yesterdayRevenue, double attendancePercent, double currentStock) {
        List<String> alerts = new ArrayList<>();

        // Revenue alerts
        if (todayRevenue == 0) {
            alerts.add("NO SALES TODAY - Check business operations");
        } else if (yesterdayRevenue > 0 && todayRevenue < yesterdayRevenue * 0.5) {
            alerts.add("REVENUE DROP - Sales 50% below yesterday");
        }

        // Attendance alerts
        if (attendancePercent < 60) {
            alerts.add("CRITICAL ATTENDANCE - Below 60%, urgent action needed");
        } else if (attendancePercent < 80) {
            alerts.add("LOW ATTENDANCE - Monitor team closely");
        }

        // Stock alert
        if (currentStock < 100) {
            alerts.add("LOW STOCK - Immediate reorder required");
        }

        return alerts;
    }

    private String generateAIBrief(double todayRevenue, double yesterdayRevenue, double attendancePercent, String topProduct, int stockAlertCount) {
        StringBuilder brief = new StringBuilder();
        brief.append("AI BRIEF: ");

        if (todayRevenue > yesterdayRevenue) {
            brief.append(String.format("Strong day ahead! Revenue ₹%.0f (↑ from yesterday). ", todayRevenue));
        } else if (todayRevenue > 0) {
            brief.append(String.format("Revenue ₹%.0f today. ", todayRevenue));
        } else {
            brief.append("No sales recorded yet. ");
        }

        brief.append(String.format("Team attendance: %.0f%%. ", attendancePercent));
        brief.append(String.format("Top product: %s. ", topProduct));

        if (stockAlertCount > 0) {
            brief.append(String.format(" %d stock alerts need attention.", stockAlertCount));
        }

        return brief.toString();
    }

    private List<String> generateRecommendations(double todayRevenue, double yesterdayRevenue, double attendancePercent, List<Map<String, Object>> stockAlerts) {
        List<String> recs = new ArrayList<>();

        if (todayRevenue < yesterdayRevenue * 0.7) {
            recs.add("Boost sales: Run promotional campaign or check staffing levels");
        }

        if (attendancePercent < 85) {
            recs.add("Improve attendance: Address absenteeism or review work conditions");
        }

        long criticalStock = stockAlerts.stream()
            .filter(a -> "CRITICAL".equals(a.get("status")))
            .count();
        if (criticalStock > 0) {
            recs.add("Urgent reorder: " + criticalStock + " products at critical stock levels");
        }

        if (recs.isEmpty()) {
            recs.add("All metrics looking good! Keep up the momentum.");
        }

        return recs;
    }
}
