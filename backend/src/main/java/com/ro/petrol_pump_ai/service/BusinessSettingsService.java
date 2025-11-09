package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.BusinessSettings;
import com.ro.petrol_pump_ai.repository.BusinessSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class BusinessSettingsService {

    @Autowired
    private BusinessSettingsRepository businessSettingsRepository;

    public BusinessSettings getSettings() {
        return businessSettingsRepository.findFirstByOrderByIdAsc();
    }

    public BusinessSettings saveSettings(BusinessSettings settings) {
        return businessSettingsRepository.save(settings);
    }

    public Optional<BusinessSettings> updateSettings(Long id, BusinessSettings updatedSettings) {
        return businessSettingsRepository.findById(id).map(existing -> {
            existing.setCompanyName(updatedSettings.getCompanyName());
            existing.setOwnerName(updatedSettings.getOwnerName());
            existing.setBusinessAddress(updatedSettings.getBusinessAddress());
            existing.setGstNumber(updatedSettings.getGstNumber());
            existing.setEmailAddress(updatedSettings.getEmailAddress());
            existing.setDailyEmailEnabled(updatedSettings.getDailyEmailEnabled());
            existing.setEmailScheduleTime(updatedSettings.getEmailScheduleTime());
            existing.setPhoneNumber(updatedSettings.getPhoneNumber());
            existing.setSupportEmail(updatedSettings.getSupportEmail());
            return businessSettingsRepository.save(existing);
        });
    }
}
