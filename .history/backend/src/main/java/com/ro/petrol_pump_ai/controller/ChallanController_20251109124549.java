package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.dto.ChallanExtractedData;
import com.ro.petrol_pump_ai.dto.ChallanRequest;
import com.ro.petrol_pump_ai.entity.Challan;
import com.ro.petrol_pump_ai.service.AIExtractorService;
import com.ro.petrol_pump_ai.service.ChallanService;
import com.ro.petrol_pump_ai.service.OCRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;


@RestController
@RequestMapping("/api/challans")
@CrossOrigin(origins = "*")
public class ChallanController {

    @Autowired
    private ChallanService challanService;

    @Autowired
    private OCRService ocrService;

    @Autowired
    private AIExtractorService aiExtractorService;

    // Upload and extract with OCR only
    @PostMapping("/upload-extract")
    public ResponseEntity<?> uploadAndExtract(@RequestParam("file") MultipartFile file) {
        try {
             System.out.println("Starting OCR---------------------------------");
            ChallanExtractedData extractedData = ocrService.extractChallanData(file);
            return ResponseEntity.ok(extractedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // Upload, extract with OCR, then refine with Gemini AI
    @PostMapping("/upload-extract-ai")
    public ResponseEntity<?> uploadExtractAndRefineWithAI(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Starting OCR + AI pipeline...---------------------------------");
            
            // Step 1: Extract with OCR
            System.out.println("Step 1: Extracting text with OCR...=========================");
            ChallanExtractedData ocrData = ocrService.extractChallanData(file);
            
            // Step 2: Refine with Groq AI
            System.out.println("Step 2: Refining with Groq AI...=========================");
            ChallanExtractedData refinedData = aiExtractorService.refineWithAI(ocrData.getRawText());

             // If challanNumber is missing, give it a default value
        if (refinedData.getChallanNumber() == null || refinedData.getChallanNumber().isEmpty()) {
            refinedData.setChallanNumber("87654321");
        }

            // Save to DB
        Challan challanToSave = mapExtractedDataToEntity(refinedData);
        Challan savedChallan = challanService.saveChallan(challanToSave);

        // Include saved entity's ID in response
        return ResponseEntity.ok(savedChallan);
            
            // return ResponseEntity.ok(refinedData);
        } catch (Exception e) {
            e.printStackTrace();
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

    private Challan mapExtractedDataToEntity(ChallanExtractedData data) {
    Challan challan = new Challan();
    challan.setDate(data.getDate());
    challan.setFuelType(data.getFuelType());
    challan.setQuantity(data.getQuantity());
    challan.setPricePerLiter(data.getPricePerLiter());
    challan.setTotalAmount(data.getTotalAmount());
    challan.setVendorName(data.getVendorName());
    challan.setChallanNumber(data.getChallanNumber());
    return challan;
}

@GetMapping("/recent")
public ResponseEntity<?> getLast7Challans() {
    try {
        List<Challan> recentChallans = challanService.getLastNChallans(7);
        return ResponseEntity.ok(recentChallans);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch recent challans");
    }
}
@PutMapping("/{id}")
    public ResponseEntity<?> updateChallan(@PathVariable Long id, @RequestBody Challan updatedChallan) {
        try {
            Challan existing = challanService.findById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Challan not found");
            }
            // Update fields
            existing.setFuelType(updatedChallan.getFuelType());
            existing.setQuantity(updatedChallan.getQuantity());
            existing.setPricePerLiter(updatedChallan.getPricePerLiter());
            existing.setTotalAmount(updatedChallan.getTotalAmount());
            existing.setVendorName(updatedChallan.getVendorName());
            existing.setChallanNumber(updatedChallan.getChallanNumber());

            Challan saved = challanService.saveChallan(existing);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update challan");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChallan(@PathVariable Long id) {
        try {
            challanService.deleteById(id);
            return ResponseEntity.ok("Challan deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete challan");
        }
    }


}
