package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.entity.Product;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import com.ro.petrol_pump_ai.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DailySalesReportService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    @Autowired
    private ProductRepository productRepository;

    public Map<String, Object> generateDailySalesReport(LocalDate startDate, LocalDate endDate) {
        // Fetch last 7 days of data
        LocalDate adjustedStartDate = endDate.minusDays(6);
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(adjustedStartDate, endDate);

        // Fetch ALL products from database to show even if no sales
        List<Product> allProducts = productRepository.findAll();

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

        // ===== DAILY TREND DATA (Chronologically ordered) =====
        List<Map<String, Object>> dailyTrendData = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = endDate.minusDays(i);
            double dayRevenue = entries.stream()
                .filter(e -> e.getEntryDate().equals(date))
                .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
                .sum();
            double dayQuantity = entries.stream()
                .filter(e -> e.getEntryDate().equals(date))
                .mapToDouble(e -> e.getSalesToday() != null ? e.getSalesToday() : 0)
                .sum();
            double dayPrice = entries.stream()
                .filter(e -> e.getEntryDate().equals(date))
                .mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0)
                .average().orElse(0);

            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.toString());
            dayData.put("revenue", dayRevenue);
            dayData.put("quantity", dayQuantity);
            dayData.put("price", dayPrice);
            dailyTrendData.add(dayData);
        }
        report.put("dailyTrendData", dailyTrendData);

        // ===== PRODUCT-WISE BREAKDOWN (ALL PRODUCTS) =====
        Map<Long, Map<String, Object>> productMap = new HashMap<>();

        // Initialize all products with zero values
        for (Product product : allProducts) {
            Map<String, Object> productData = new HashMap<>();
            productData.put("productId", product.getId());
            productData.put("productName", product.getName());
            productData.put("totalQuantity", 0.0);
            productData.put("totalRevenue", 0.0);
            productMap.put(product.getId(), productData);
        }

        // Populate actual sales data
        for (DailyEntry entry : entries) {
            if (entry.getProduct() == null) continue;

            Long productId = entry.getProduct().getId();
            if (productMap.containsKey(productId)) {
                Map<String, Object> productData = productMap.get(productId);
                double currentQuantity = (double) productData.get("totalQuantity");
                double currentRevenue = (double) productData.get("totalRevenue");

                productData.put("totalQuantity", currentQuantity + (entry.getSalesToday() != null ? entry.getSalesToday() : 0));
                productData.put("totalRevenue", currentRevenue + (entry.getDailyRevenue() != null ? entry.getDailyRevenue() : 0));
            }
        }

        List<Map<String, Object>> productBreakdown = new ArrayList<>(productMap.values());
        report.put("productBreakdown", productBreakdown);

        // ===== PIE CHART DATA =====
        List<Map<String, Object>> productPieData = productBreakdown.stream()
            .filter(p -> (double) p.get("totalQuantity") > 0) // Only show products with sales
            .map(p -> {
                Map<String, Object> pie = new HashMap<>();
                pie.put("name", p.get("productName"));
                pie.put("value", p.get("totalQuantity"));
                pie.put("revenue", p.get("totalRevenue"));
                return pie;
            })
            .collect(Collectors.toList());
        report.put("productPieData", productPieData);

        // ===== ENHANCED AI INSIGHTS =====
        report.put("aiInsights", generateEnhancedAIInsights(entries, productBreakdown, dailyTrendData, totalRevenue, totalSales));

        return report;
    }

    private Map<String, Object> generateEnhancedAIInsights(
            List<DailyEntry> entries,
            List<Map<String, Object>> productBreakdown,
            List<Map<String, Object>> dailyTrendData,
            double totalRevenue,
            double totalSales) {

        Map<String, Object> insights = new HashMap<>();

        // 1. Top Performing Product
        String topProduct = productBreakdown.stream()
            .max(Comparator.comparing(p -> (double) p.get("totalQuantity")))
            .map(p -> (String) p.get("productName"))
            .orElse("N/A");
        double topProductSales = productBreakdown.stream()
            .max(Comparator.comparing(p -> (double) p.get("totalQuantity")))
            .map(p -> (double) p.get("totalQuantity"))
            .orElse(0.0);
        insights.put("topProduct", topProduct);
        insights.put("topProductSales", topProductSales);

        // 2. Revenue Trend Analysis
        if (dailyTrendData.size() >= 2) {
            double firstDayRevenue = (double) dailyTrendData.get(0).get("revenue");
            double lastDayRevenue = (double) dailyTrendData.get(dailyTrendData.size() - 1).get("revenue");
            double trend = lastDayRevenue - firstDayRevenue;
            String trendDirection = trend > 0 ? "increasing" : (trend < 0 ? "decreasing" : "stable");
            insights.put("revenueTrend", trendDirection);
            insights.put("trendPercentage", firstDayRevenue > 0 ? (trend / firstDayRevenue) * 100 : 0);
        }

        // 3. Best Selling Day
        Map<String, Object> bestDay = dailyTrendData.stream()
            .max(Comparator.comparing(d -> (double) d.get("revenue")))
            .orElse(null);
        if (bestDay != null) {
            insights.put("bestDay", bestDay.get("date"));
            insights.put("bestDayRevenue", bestDay.get("revenue"));
        }

        // 4. Product Performance Comparison
        List<String> lowPerformingProducts = productBreakdown.stream()
            .filter(p -> (double) p.get("totalQuantity") == 0)
            .map(p -> (String) p.get("productName"))
            .collect(Collectors.toList());
        insights.put("lowPerformingProducts", lowPerformingProducts);

        // 5. Revenue per Liter
        double revenuePerLiter = totalSales > 0 ? totalRevenue / totalSales : 0;
        insights.put("revenuePerLiter", revenuePerLiter);

        // 6. Summary Insight
        String summary = String.format(
            "AI ANALYSIS: %s is your top seller with %.0f liters sold. " +
            "Revenue trend is %s over the last 7 days. " +
            "Average revenue per liter: ₹%.2f. " +
            "%s",
            topProduct,
            topProductSales,
            insights.get("revenueTrend"),
            revenuePerLiter,
            lowPerformingProducts.isEmpty() 
                ? "All products are performing well!" 
                : "Products with no sales: " + String.join(", ", lowPerformingProducts)
        );
        insights.put("summary", summary);

        return insights;
    }
}
