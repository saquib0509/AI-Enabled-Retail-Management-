package com.ro.petrol_pump_ai.repository;

import com.ro.petrol_pump_ai.entity.CrowdMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface CrowdMetricsRepository extends JpaRepository<CrowdMetrics, Long> {
    
    // Get crowd metrics for a specific date
    @Query("SELECT c FROM CrowdMetrics c WHERE DATE(c.timestamp) = ?1 ORDER BY c.timeSlot ASC")
    List<CrowdMetrics> findByDate(LocalDate date);
    
    // Get crowdiest hours for a date
    @Query("SELECT c FROM CrowdMetrics c WHERE DATE(c.timestamp) = ?1 ORDER BY c.crowdCount DESC LIMIT 5")
    List<CrowdMetrics> findPeakHours(LocalDate date);
    
    // Get average crowd per hour
    @Query("SELECT c FROM CrowdMetrics c WHERE DATE(c.timestamp) >= ?1 AND c.timeSlot = ?2 ORDER BY c.timestamp DESC LIMIT 10")
    List<CrowdMetrics> findByTimeSlot(LocalDate fromDate, LocalTime timeSlot);
    
    // Get last N records
    @Query("SELECT c FROM CrowdMetrics c ORDER BY c.timestamp DESC LIMIT ?1")
    List<CrowdMetrics> getLastNRecords(int limit);
}
