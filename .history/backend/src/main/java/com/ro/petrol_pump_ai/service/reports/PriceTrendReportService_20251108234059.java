package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PriceTrendReportService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    public Map<String, Object> generatePriceTrendReport(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);

        // Sort by date
        entries = entries.stream()
            .sorted(Comparator.comparing(DailyEntry::getEntryDate))
            .collect(Collectors.toList());

        Map<String, Object> report = new HashMap<>();

        // ===== PRICE DATA FOR CHART =====
        List<Map<String, Object>> priceData = entries.stream().map(e -> {
            Map<String, Object> day = new HashMap<>();
            day.put("date", e.getEntryDate().toString());
            day.put("dateLabel", e.getEntryDate().getDayOfMonth() + "/" + e.getEntryDate().getMonthValue());
            day.put("price", e.getPricePerUnit() != null ? e.getPricePerUnit() : 0);
            day.put("quantity", e.getSalesToday() != null ? e.getSalesToday() : 0);
            day.put("revenue", e.getDailyRevenue() != null ? e.getDailyRevenue() : 0);
            return day;
        }).collect(Collectors.toList());

        report.put("priceData", priceData);

        // ===== PRICE STATISTICS =====
        double avgPrice = entries.stream()
            .mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0)
            .average().orElse(0);
        double maxPrice = entries.stream()
            .mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0)
            .max().orElse(0);
        double minPrice = entries.stream()
            .mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0)
            .min().orElse(0);
        
        report.put("avgPrice", avgPrice);
        report.put("maxPrice", maxPrice);
        report.put("minPrice", minPrice);

        // ===== VOLATILITY ANALYSIS =====
        double volatility = ((maxPrice - minPrice) / avgPrice) * 100;
        double[] prices = entries.stream()
            .mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0)
            .toArray();
        
        double variance = 0;
        for (double price : prices) {
            variance += Math.pow(price - avgPrice, 2);
        }
        double standardDeviation = Math.sqrt(variance / prices.length);

        report.put("volatility", volatility);
        report.put("standardDeviation", standardDeviation);

        // ===== PRICE TREND =====
        if (entries.size() >= 2) {
            double firstPrice = entries.get(0).getPricePerUnit() != null ? entries.get(0).getPricePerUnit() : 0;
            double lastPrice = entries.get(entries.size() - 1).getPricePerUnit() != null ? entries.get(entries.size() - 1).getPricePerUnit() : 0;
            double priceChange = lastPrice - firstPrice;
            double priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

            report.put("priceChange", priceChange);
            report.put("priceChangePercent", priceChangePercent);
        }

        // ===== DEMAND ANALYSIS (Price vs Quantity) =====
        double avgQuantity = entries.stream()
            .mapToDouble(e -> e.getSalesToday() != null ? e.getSalesToday() : 0)
            .average().orElse(0);
        
        // Calculate correlation between price and quantity (elasticity indicator)
        double sumPriceQuantity = 0;
        double sumPrice = 0;
        double sumQuantity = 0;
        double sumPriceSquared = 0;
        double sumQuantitySquared = 0;

        for (DailyEntry e : entries) {
            double price = e.getPricePerUnit() != null ? e.getPricePerUnit() : 0;
            double quantity = e.getSalesToday() != null ? e.getSalesToday() : 0;
            sumPriceQuantity += price * quantity;
            sumPrice += price;
            sumQuantity += quantity;
            sumPriceSquared += price * price;
            sumQuantitySquared += quantity * quantity;
        }

        int n = entries.size();
        double numerator = (n * sumPriceQuantity) - (sumPrice * sumQuantity);
        double denominator = Math.sqrt((n * sumPriceSquared - sumPrice * sumPrice) * (n * sumQuantitySquared - sumQuantity * sumQuantity));
        double priceElasticity = denominator != 0 ? numerator / denominator : 0;

        report.put("avgQuantity", avgQuantity);
        report.put("priceElasticity", priceElasticity);

        // ===== REVENUE OPTIMIZATION =====
        double totalRevenue = entries.stream()
            .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
            .sum();
        double avgRevenue = entries.size() > 0 ? totalRevenue / entries.size() : 0;

        report.put("totalRevenue", totalRevenue);
        report.put("avgRevenue", avgRevenue);

        // ===== PRICE CATEGORIES (HIGH/LOW/MEDIUM) =====
        double priceRange = maxPrice - minPrice;
        double lowThreshold = minPrice + (priceRange * 0.33);
        double highThreshold = minPrice + (priceRange * 0.66);

        long lowPriceDays = entries.stream().filter(e -> e.getPricePerUnit() != null && e.getPricePerUnit() <= lowThreshold).count();
        long mediumPriceDays = entries.stream().filter(e -> e.getPricePerUnit() != null && e.getPricePerUnit() > lowThreshold && e.getPricePerUnit() <= highThreshold).count();
        long highPriceDays = entries.stream().filter(e -> e.getPricePerUnit() != null && e.getPricePerUnit() > highThreshold).count();

        report.put("lowPriceDays", lowPriceDays);
        report.put("mediumPriceDays", mediumPriceDays);
        report.put("highPriceDays", highPriceDays);

        // ===== ENHANCED AI INSIGHTS =====
        report.put("aiInsights", generateEnhancedAIInsights(
            avgPrice, maxPrice, minPrice, volatility, priceElasticity,
            avgQuantity, totalRevenue, avgRevenue, standardDeviation,
            entries.size() >= 2 ? ((DailyEntry) entries.stream().skip(entries.size() - 1).findFirst().orElse(null)).getPricePerUnit() : avgPrice,
            lowPriceDays, mediumPriceDays, highPriceDays
        ));

        return report;
    }

    private Map<String, Object> generateEnhancedAIInsights(
            double avgPrice, double maxPrice, double minPrice, double volatility,
            double priceElasticity, double avgQuantity, double totalRevenue, double avgRevenue,
            double standardDeviation, double currentPrice,
            long lowPriceDays, long mediumPriceDays, long highPriceDays) {

        Map<String, Object> insights = new HashMap<>();

        // 1. Volatility Assessment
        String volatilityStatus;
        String volatilityEmoji;
        if (volatility < 5) {
            volatilityStatus = "Stable - Consistent pricing";
            volatilityEmoji = "";
        } else if (volatility < 15) {
            volatilityStatus = "Moderate - Some fluctuation";
            volatilityEmoji = "";
        } else if (volatility < 30) {
            volatilityStatus = "High - Frequent changes";
            volatilityEmoji = "";
        } else {
            volatilityStatus = "Very High - Unstable pricing";
            volatilityEmoji = "";
        }
        insights.put("volatilityStatus", volatilityStatus);
        insights.put("volatilityEmoji", volatilityEmoji);

        // 2. Price Elasticity Analysis
        String elasticityAnalysis;
        String demandResponse;
        if (Math.abs(priceElasticity) < 0.5) {
            elasticityAnalysis = "Inelastic - Demand insensitive to price changes";
            demandResponse = "Price changes have minimal impact on sales";
        } else if (Math.abs(priceElasticity) < 1.0) {
            elasticityAnalysis = "Relatively Inelastic - Moderate price sensitivity";
            demandResponse = "Demand moderately responds to pricing";
        } else if (Math.abs(priceElasticity) < 1.5) {
            elasticityAnalysis = "Unit Elastic - Proportional to price changes";
            demandResponse = "Demand changes proportionally with price";
        } else {
            elasticityAnalysis = "Elastic - Highly price sensitive";
            demandResponse = "High sensitivity to price changes";
        }
        insights.put("elasticityAnalysis", elasticityAnalysis);
        insights.put("demandResponse", demandResponse);

        // 3. Pricing Recommendation
        String pricingRecommendation;
        if (priceElasticity > 0.5) {
            // Price and quantity inversely correlated (typical)
            pricingRecommendation = "Consider strategic price adjustments - demand is price sensitive";
        } else if (Math.abs(priceElasticity) < 0.3) {
            pricingRecommendation = "Price increase opportunity - customers less price sensitive";
        } else {
            pricingRecommendation = "Maintain competitive pricing - market is balanced";
        }
        insights.put("pricingRecommendation", pricingRecommendation);

        // 4. Current Price Position
        String pricePosition;
        double pricePercentile = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
        if (pricePercentile < 33) {
            pricePosition = "LOW - Below average market price";
        } else if (pricePercentile < 66) {
            pricePosition = "MEDIUM - At average market price";
        } else {
            pricePosition = "HIGH - Above average market price";
        }
        insights.put("pricePosition", pricePosition);
        insights.put("pricePercentile", pricePercentile);

        // 5. Revenue Optimization
        double revenuePercentile = (avgRevenue / totalRevenue) * 100;
        String revenueStatus;
        if (revenuePercentile > 60) {
            revenueStatus = "Strong - Revenue performing well";
        } else if (revenuePercentile > 40) {
            revenueStatus = "Moderate - Revenue acceptable";
        } else {
            revenueStatus = "Weak - Revenue needs improvement";
        }
        insights.put("revenueStatus", revenueStatus);

        // 6. Summary Insight
        String summary = String.format(
            "AI PRICE INTELLIGENCE: Current price: ₹%.2f. %s %s Volatility: %.1f%% (Std Dev: ₹%.2f). " +
            "Price range: ₹%.2f - ₹%.2f (Avg: ₹%.2f). " +
            "Elasticity Analysis: %s. %s " +
            "Recommendation: %s " +
            "Current Position: %s (%.0f percentile). Average daily quantity: %.0f units. %s",
            currentPrice,
            volatilityEmoji,
            volatilityStatus,
            volatility,
            standardDeviation,
            minPrice,
            maxPrice,
            avgPrice,
            elasticityAnalysis,
            demandResponse,
            pricingRecommendation,
            pricePosition,
            pricePercentile,
            avgQuantity,
            revenueStatus
        );
        insights.put("summary", summary);

        return insights;
    }
}
