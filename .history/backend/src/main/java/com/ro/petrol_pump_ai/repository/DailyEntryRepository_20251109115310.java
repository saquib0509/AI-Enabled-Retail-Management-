package com.ro.petrol_pump_ai.repository;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyEntryRepository extends JpaRepository<DailyEntry, Long> {
    
    // Get all entries ordered by date (newest first)
    List<DailyEntry> findAllByOrderByEntryDateDesc();
    
    // Get entries by date
    List<DailyEntry> findByEntryDate(LocalDate entryDate);
    
    // Get entries between two dates
    List<DailyEntry> findByEntryDateBetweenOrderByEntryDateDesc(LocalDate from, LocalDate to);
    
    // Get entries by product
    List<DailyEntry> findByProductIdOrderByEntryDateDesc(Long productId);
    
    // Get last entry for a product
    Optional<DailyEntry> findTopByProductOrderByEntryDateDesc(Product product);
    
    // Get last N entries
    List<DailyEntry> findTopNByOrderByEntryDateDesc(int limit);
}
