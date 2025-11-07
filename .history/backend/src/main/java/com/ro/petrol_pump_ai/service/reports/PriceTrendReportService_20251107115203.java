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

        Map<String, Object> report = new HashMap<>();

        List<Map<String, Object>> priceData = entries.stream().map(e -> {
            Map<String, Object> day = new HashMap<>();
            day.put("date", e.getEntryDate());
            day.put("pricePerLiter", e.getPricePerUnit());
            day.put("salesVolume", e.getSalesToday());
            return day;
        }).collect(Collectors.toList());

        report.put("priceData", priceData);

        double avgPrice = entries.stream()
            .mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0)
            .average().orElse(0);
        double maxPrice = entries.stream()
            .mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0)
            .max().orElse(0);
        double minPrice = entries.stream()
            .mapToDouble(e -> e.getPricePerUnit() != null ? e.getPricePerUnit() : 0)
            .min().orElse(0);
        double volatility = ((maxPrice - minPrice) / avgPrice) * 100;

        report.put("avgPrice", avgPrice);
        report.put("maxPrice", maxPrice);
        report.put("minPrice", minPrice);
        report.put("volatility", volatility);
        report.put("aiElasticityInsight", "Price volatility: " + String.format("%.2f", volatility) + "%. Consider market conditions.");

        return report;
    }
}
