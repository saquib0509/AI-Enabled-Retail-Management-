package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.dto.ChallanExtractedData;
import com.ro.petrol_pump_ai.dto.ChallanRequest;
import com.ro.petrol_pump_ai.entity.Challan;
import com.ro.petrol_pump_ai.service.ChallanService;
import com.ro.petrol_pump_ai.service.OCRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/challans")
@CrossOrigin(origins = "*")
public class ChallanController {

    @Autowired
    private ChallanService challanService;

    @Autowired
    private OCRService ocrService;

    // Upload and extract with OCR only
    @PostMapping("/upload-extract")
    public ResponseEntity<?> uploadAndExtract(@RequestParam("file") MultipartFile file) {
        try {
            ChallanExtractedData extractedData = ocrService.extractChallanData(file);
            return ResponseEntity.ok(extractedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // Save challan
    @PostMapping
    public ResponseEntity<Challan> saveChallan(@RequestBody ChallanRequest request) {
        try {
            Challan challan = new Challan();
            challan.setDate(request.getDate());
            challan.setFuelType(request.getFuelType());
            challan.setQuantity(request.getQuantity());
            challan.setPricePerLiter(request.getPricePerLiter());
            challan.setTotalAmount(request.getTotalAmount());
            challan.setVendorName(request.getVendorName());
            challan.setChallanNumber(request.getChallanNumber());
            
            return ResponseEntity.ok(challanService.saveChallan(challan));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Get all
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(challanService.getAll());
    }
}
