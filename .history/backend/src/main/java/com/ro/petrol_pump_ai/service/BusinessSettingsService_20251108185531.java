package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.repository.BusinessSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BusinessSettingsService {

    @Autowired
    private BusinessSettingsRepository businessSettingsRepository;
}

