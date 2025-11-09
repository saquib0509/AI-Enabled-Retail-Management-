package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.CrowdMetrics;
import com.ro.petrol_pump_ai.repository.CrowdMetricsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class CrowdMetricsService {
    
    @Autowired
    private CrowdMetricsRepository crowdMetricsRepository;
    
    /**
     * Save crowd detection data
     */
    public CrowdMetrics saveCrowdMetrics(Integer crowdCount, Double confidence) {
        CrowdMetrics metrics = new CrowdMetrics();
        metrics.setCrowdCount(crowdCount);
        metrics.setConfidence(confidence);
        metrics.setTimeSlot(LocalTime.now().withMinute(0).withSecond(0).withNano(0));
        metrics.setCrowdLevel(determineCrowdLevel(crowdCount));
        
        return crowdMetricsRepository.save(metrics);
    }
    
    /**
     * Determine crowd level based on count
     */
    private String determineCrowdLevel(Integer count) {
        if (count <= 2) return "LOW";
        if (count <= 5) return "MEDIUM";
        if (count <= 10) return "HIGH";
        return "PEAK";
    }
    
    /**
     * Get today's crowd data
     */
    public List<CrowdMetrics> getTodayMetrics() {
        return crowdMetricsRepository.findByDate(LocalDate.now());
    }
    
    /**
     * Get peak hours for today
     */
    public List<CrowdMetrics> getPeakHours() {
        return crowdMetricsRepository.findPeakHours(LocalDate.now());
    }
    
    /**
     * Get crowd data by hour (average)
     */
    public Map<String, Object> getHourlyAnalysis() {
        List<CrowdMetrics> todayData = getTodayMetrics();
        Map<String, Object> analysis = new HashMap<>();
        
        Map<LocalTime, Integer> hourlyAverage = new HashMap<>();
        Map<LocalTime, Integer> hourlyMax = new HashMap<>();
        
        for (CrowdMetrics metric : todayData) {
            LocalTime hour = metric.getTimeSlot();
            
            // Calculate average
            hourlyAverage.put(hour, 
                hourlyAverage.getOrDefault(hour, 0) + metric.getCrowdCount());
            
            // Track max
            int max = hourlyMax.getOrDefault(hour, 0);
            hourlyMax.put(hour, Math.max(max, metric.getCrowdCount()));
        }
        
        analysis.put("hourlyAverage", hourlyAverage);
        analysis.put("hourlyMax", hourlyMax);
        analysis.put("peakHour", getPeakHours().get(0));
        
        return analysis;
    }
    
    /**
     * Get last N records
     */
    public List<CrowdMetrics> getLastNRecords(int limit) {
        return crowdMetricsRepository.getLastNRecords(limit);
    }
}
