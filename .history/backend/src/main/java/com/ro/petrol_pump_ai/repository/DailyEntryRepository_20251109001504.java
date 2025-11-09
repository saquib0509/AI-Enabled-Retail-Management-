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
    
    List<DailyEntry> findByEntryDate(LocalDate entryDate);
    
    List<DailyEntry> findByEntryDateBetweenOrderByEntryDateDesc(LocalDate startDate, LocalDate endDate);
    
    Optional<DailyEntry> findTopByProductOrderByEntryDateDesc(Product product);
    
    List<DailyEntry> findByProductOrderByEntryDateDesc(Product product);
    
    Optional<DailyEntry> findByEntryDateAndProduct(LocalDate entryDate, Product product);

    List<DailyEntry> findByEntryDateBetween(LocalDate startDate, LocalDate endDate);
}
