package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.Challan;
import com.ro.petrol_pump_ai.repository.ChallanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
}
