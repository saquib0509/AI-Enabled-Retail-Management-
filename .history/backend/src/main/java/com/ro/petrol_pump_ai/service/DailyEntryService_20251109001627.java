package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.entity.Product;
import com.ro.petrol_pump_ai.dto.DailyEntryRequest;
import com.ro.petrol_pump_ai.dto.DailyEntryResponse;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import com.ro.petrol_pump_ai.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DailyEntryService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    @Autowired
    private ProductRepository productRepository;

    public DailyEntryResponse createDailyEntry(DailyEntryRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        DailyEntry entry = new DailyEntry();
        entry.setEntryDate(request.getEntryDate());
        entry.setProduct(product);
        entry.setOpeningStock(request.getOpeningStock());
        entry.setSalesToday(request.getSalesToday());
        entry.setUnderTankDelivery(request.getUnderTankDelivery());
        entry.setPricePerUnit(request.getPricePerUnit());
        entry.setTemperature(request.getTemperature());
        entry.setNotes(request.getNotes());

        entry.calculateClosingStock();
        entry.calculateRevenue();

        DailyEntry savedEntry = dailyEntryRepository.save(entry);
        return convertToResponse(savedEntry);
    }

    public DailyEntryResponse getEntryById(Long id) {
        DailyEntry entry = dailyEntryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Entry not found"));
        return convertToResponse(entry);
    }

    public List<DailyEntryResponse> getTodayEntries() {
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDate(LocalDate.now());
        return entries.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<DailyEntryResponse> getLast7DaysEntries() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetweenOrderByEntryDateDesc(startDate, endDate);
        return entries.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public DailyEntryResponse getLastEntryForProduct(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        Optional<DailyEntry> entry = dailyEntryRepository.findTopByProductOrderByEntryDateDesc(product);
        return entry.map(this::convertToResponse).orElse(null);
    }

    public DailyEntryResponse updateDailyEntry(Long id, DailyEntryRequest request) {
        DailyEntry entry = dailyEntryRepository.findById(id).orElseThrow(() -> new RuntimeException("Entry not found"));

        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        entry.setProduct(product);
        entry.setOpeningStock(request.getOpeningStock());
        entry.setSalesToday(request.getSalesToday());
        entry.setUnderTankDelivery(request.getUnderTankDelivery());
        entry.setPricePerUnit(request.getPricePerUnit());
        entry.setTemperature(request.getTemperature());
        entry.setNotes(request.getNotes());

        entry.calculateClosingStock();
        entry.calculateRevenue();

        DailyEntry updatedEntry = dailyEntryRepository.save(entry);
        return convertToResponse(updatedEntry);
    }

    public void deleteDailyEntry(Long id) {
        if (!dailyEntryRepository.existsById(id)) {
            throw new RuntimeException("Entry not found");
        }
        dailyEntryRepository.deleteById(id);
    }

    private DailyEntryResponse convertToResponse(DailyEntry entry) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return new DailyEntryResponse(
            entry.getId(),
            entry.getEntryDate(),
            entry.getProduct().getName(),
            entry.getOpeningStock(),
            entry.getSalesToday(),
            entry.getUnderTankDelivery(),
            entry.getClosingStock(),
            entry.getPricePerUnit(),
            entry.getDailyRevenue(),
            entry.getTemperature(),
            entry.getNotes(),
            entry.getCreatedAt() != null ? entry.getCreatedAt().format(formatter) : null
        );
    }

    
}
