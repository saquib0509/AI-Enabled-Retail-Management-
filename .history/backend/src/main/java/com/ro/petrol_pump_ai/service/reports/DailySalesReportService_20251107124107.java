package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DailySalesReportService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    public Map<String, Object> generateDailySalesReport(LocalDate startDate, LocalDate endDate) {
        // Fetch last 7 days of data with proper date ordering
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

        // ===== LINE CHART DATA (Daily Trend - CHRONOLOGICALLY ORDERED) =====
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

        // ===== PRODUCT-WISE BREAKDOWN =====
        // Group sales by product using Product object (not productId)
        Map<Long, Map<String, Object>> productMap = new HashMap<>();

        for (DailyEntry entry : entries) {
            if (entry.getProduct() == null) continue;

            Long productId = entry.getProduct().getId();
            String productName = entry.getProduct().getName();

            productMap.putIfAbsent(productId, new HashMap<>());
            Map<String, Object> productData = productMap.get(productId);

            double currentQuantity = (double) productData.getOrDefault("totalQuantity", 0.0);
            double currentRevenue = (double) productData.getOrDefault("totalRevenue", 0.0);

            productData.put("totalQuantity", currentQuantity + (entry.getSalesToday() != null ? entry.getSalesToday() : 0));
            productData.put("totalRevenue", currentRevenue + (entry.getDailyRevenue() != null ? entry.getDailyRevenue() : 0));
            productData.put("productId", productId);
            productData.put("productName", productName);
        }

        List<Map<String, Object>> productBreakdown = new ArrayList<>(productMap.values());
        report.put("productBreakdown", productBreakdown);

        // ===== PIE CHART DATA (Product-wise sales share) =====
        List<Map<String, Object>> productPieData = productBreakdown.stream()
            .map(p -> {
                Map<String, Object> pie = new HashMap<>();
                pie.put("name", p.get("productName")); // Use actual product name
                pie.put("value", p.get("totalQuantity"));
                pie.put("revenue", p.get("totalRevenue"));
                return pie;
            })
            .collect(Collectors.toList());
        report.put("productPieData", productPieData);

        // ===== AI INSIGHT =====
        String topProduct = productBreakdown.stream()
            .max(Comparator.comparing(p -> (double) p.getOrDefault("totalQuantity", 0.0)))
            .map(p -> (String) p.get("productName"))
            .orElse("Unknown");

        String insight = String.format(
            "📈 Last 7 days: ₹%.0f revenue, %.0f liters sold, ₹%.2f avg price/liter. Top product: %s",
            totalRevenue, totalSales, avgPricePerLiter, topProduct
        );
        report.put("aiInsight", insight);

        return report;
    }
}
