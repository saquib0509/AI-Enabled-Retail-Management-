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
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);

        Map<String, Object> report = new HashMap<>();

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

        List<Map<String, Object>> dailyData = entries.stream().map(e -> {
            Map<String, Object> day = new HashMap<>();
            day.put("date", e.getEntryDate());
            day.put("revenue", e.getDailyRevenue());
            day.put("sales", e.getSalesToday());
            return day;
        }).collect(Collectors.toList());

        report.put("dailyData", dailyData);

        String aiInsight = String.format(
            "📈 Total sales: ₹%.0f. Average price per liter: ₹%.2f over %d days.",
            totalRevenue, avgPricePerLiter, entries.size()
        );
        report.put("aiInsight", aiInsight);

        return report;
    }
}
