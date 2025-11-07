package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.Challan;
import com.ro.petrol_pump_ai.repository.ChallanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.util.List;

@Service
public class ChallanService {

    @Autowired
    private ChallanRepository repository;

    public Challan saveChallan(Challan challan) {
        return repository.save(challan);
    }

    public List<Challan> getAll() {
        return repository.findAll();
    }

    public List<Challan> getLastNChallans(int n) {
        Pageable pageable = PageRequest.of(0, n, Sort.by("createdAt").descending());
        return repository.findAll(pageable).getContent();
    }

    public Challan findById(Long id) {
        return repository.findById(id).orElse(null);
    }
    
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
    
}
