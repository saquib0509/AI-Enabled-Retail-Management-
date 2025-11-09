package com.ro.petrol_pump_ai.service;

import org.springframework.stereotype.Service;

@Service
public class FuelTypeMapper {
    
    /**
     * Maps fuel codes to fuel types
     * 50700 HSD-BSVI → DIESEL
     * 16730 EBMS → PETROL
     * 17295 EBMS-XP95 → XP95
     */
    public String mapFuelType(String rawText) {
        if (rawText == null) return "UNKNOWN";
        
        String text = rawText.toUpperCase();
        
        // Diesel codes
        if (text.contains("50700") || text.contains("HSD-BSVI") || text.contains("HSD")) {
            return "DIESEL";
        }
        
        // Petrol codes
        if (text.contains("16730") || (text.contains("EBMS") && !text.contains("XP95"))) {
            return "PETROL";
        }
        
        // XP95 code
        if (text.contains("17295") || text.contains("EBMS-XP95") || text.contains("XP95")) {
            return "XP95";
        }
        
        return "UNKNOWN";
    }
    
    /**
     * Converts KL units to liters
     * 12 KL = 12000 L
     * 4 KL = 4000 L
     * 8 KL = 8000 L
     */
    public Double convertKLToLiters(Double quantity, String unit) {
        if (quantity == null) return 0.0;
        if (unit == null) return quantity;
        
        String unitUpper = unit.toUpperCase().trim();
        
        if (unitUpper.isEmpty() || unitUpper.equals("L")) {
            return quantity;
        }
        
        if (unitUpper.equals("KL")) {
            return quantity * 1000;
        }
        
        return quantity;
    }
}
