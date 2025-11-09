package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.dto.ChallanExtractedData;
import com.ro.petrol_pump_ai.dto.ChallanRequest;
import com.ro.petrol_pump_ai.entity.Challan;
import com.ro.petrol_pump_ai.service.AIExtractorService;
import com.ro.petrol_pump_ai.service.ChallanService;
import com.ro.petrol_pump_ai.service.OCRService;
import com.ro.petrol_pump_ai.service.FuelTypeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
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

    @Autowired
    private FuelTypeMapper fuelTypeMapper;

    /**
     * Upload and extract with OCR only
     * POST http://localhost:8080/api/challans/upload-extract
     */
    @PostMapping("/upload-extract")
    public ResponseEntity<?> uploadAndExtract(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Starting OCR extraction...");
            ChallanExtractedData extractedData = ocrService.extractChallanData(file);
            return ResponseEntity.ok(extractedData);
        } catch (Exception e) {
            System.err.println("OCR Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Upload, extract with OCR, then refine with Gemini AI
     * POST http://localhost:8080/api/challans/upload-extract-ai
     */
    @PostMapping("/upload-extract-ai")
    public ResponseEntity<?> uploadExtractAndRefineWithAI(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Starting OCR + AI pipeline...");
            
            // Step 1: Extract with OCR
            System.out.println("Step 1: Extracting text with OCR...");
            ChallanExtractedData ocrData = ocrService.extractChallanData(file);
            
            // Step 2: Refine with Gemini AI
            System.out.println("Step 2: Refining with Gemini AI...");
            ChallanExtractedData refinedData = aiExtractorService.refineWithAI(ocrData.getRawText());

            // Step 3: Validate and set defaults for null fields
            System.out.println("Step 3: Validating and setting defaults...");
            refinedData = validateAndSetDefaults(refinedData);
            
            // Step 4: Map to entity
            System.out.println("Step 4: Mapping to entity...");
            Challan challanToSave = mapExtractedDataToEntity(refinedData);
            
            // Step 5: Save to database
            System.out.println("Step 5: Saving to database...");
            Challan savedChallan = challanService.saveChallan(challanToSave);
            
            System.out.println("Successfully saved challan with ID: " + savedChallan.getId());
            return ResponseEntity.ok(savedChallan);
            
        } catch (Exception e) {
            System.err.println("Pipeline Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Validate and set defaults for null fields
     * Ensures no null values cause database errors
     */
    private ChallanExtractedData validateAndSetDefaults(ChallanExtractedData data) {
        // Set default date if null
        if (data.getDate() == null) {
            data.setDate(LocalDate.now());
            System.out.println("Set default date: " + LocalDate.now());
        }
        
        // Set default fuel type if null or UNKNOWN
        if (data.getFuelType() == null || data.getFuelType().isEmpty() || data.getFuelType().equals("UNKNOWN")) {
            data.setFuelType("UNKNOWN");
            System.out.println("Set default fuel type: UNKNOWN");
        }
        
        // Set default quantity if null or 0
        if (data.getQuantity() == null || data.getQuantity() <= 0) {
            data.setQuantity(0.0);
            System.out.println("Set default quantity: 0.0");
        }
        
        // Set default price per liter if null or 0
        if (data.getPricePerLiter() == null || data.getPricePerLiter() <= 0) {
            data.setPricePerLiter(0.0);
            System.out.println("Set default price per liter: 0.0");
        }
        
        // Set default total amount if null or 0
        if (data.getTotalAmount() == null || data.getTotalAmount() <= 0) {
            data.setTotalAmount(0.0);
            System.out.println("Set default total amount: 0.0");
        }
        
        // Set default vendor name if null
        if (data.getVendorName() == null || data.getVendorName().isEmpty()) {
            data.setVendorName("Unknown Vendor");
            System.out.println("Set default vendor name: Unknown Vendor");
        }
        
        // Set default challan number if null
        if (data.getChallanNumber() == null || data.getChallanNumber().isEmpty()) {
            data.setChallanNumber("GEN-" + System.currentTimeMillis());
            System.out.println("Set generated challan number: " + data.getChallanNumber());
        }
        
        return data;
    }

    /**
     * Map extracted data to Challan entity
     */
    private Challan mapExtractedDataToEntity(ChallanExtractedData data) {
        Challan challan = new Challan();
        
        challan.setDate(data.getDate() != null ? data.getDate() : LocalDate.now());
        challan.setFuelType(data.getFuelType() != null ? data.getFuelType() : "UNKNOWN");
        challan.setQuantity(data.getQuantity() != null ? data.getQuantity() : 0.0);
        challan.setPricePerLiter(data.getPricePerLiter() != null ? data.getPricePerLiter() : 0.0);
        challan.setTotalAmount(data.getTotalAmount() != null ? data.getTotalAmount() : 0.0);
        challan.setVendorName(data.getVendorName() != null ? data.getVendorName() : "Unknown");
        challan.setChallanNumber(data.getChallanNumber() != null ? data.getChallanNumber() : "GEN-" + System.currentTimeMillis());
        challan.setRawText(data.getRawText());
        challan.setConfidence(data.getConfidence() != null ? data.getConfidence() : 0.0);
        
        return challan;
    }

    /**
     * Save challan manually
     * POST http://localhost:8080/api/challans
     */
    @PostMapping
    public ResponseEntity<Challan> saveChallan(@RequestBody ChallanRequest request) {
        try {
            Challan challan = new Challan();
            challan.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
            challan.setFuelType(request.getFuelType() != null ? request.getFuelType() : "UNKNOWN");
            challan.setQuantity(request.getQuantity() != null ? request.getQuantity() : 0.0);
            challan.setPricePerLiter(request.getPricePerLiter() != null ? request.getPricePerLiter() : 0.0);
            challan.setTotalAmount(request.getTotalAmount() != null ? request.getTotalAmount() : 0.0);
            challan.setVendorName(request.getVendorName() != null ? request.getVendorName() : "Unknown");
            challan.setChallanNumber(request.getChallanNumber() != null ? request.getChallanNumber() : "GEN-" + System.currentTimeMillis());
            
            Challan saved = challanService.saveChallan(challan);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.err.println("Save Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Get all challans
     * GET http://localhost:8080/api/challans
     */
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Challan> challans = challanService.getAll();
            return ResponseEntity.ok(challans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Get last N challans
     * GET http://localhost:8080/api/challans/recent
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getLast7Challans() {
        try {
            List<Challan> recentChallans = challanService.getLastNChallans(7);
            return ResponseEntity.ok(recentChallans);
        } catch (Exception e) {
            System.err.println("Fetch Recent Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch recent challans\"}");
        }
    }

    /**
     * Update challan
     * PUT http://localhost:8080/api/challans/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateChallan(@PathVariable Long id, @RequestBody Challan updatedChallan) {
        try {
            Challan existing = challanService.findById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\": \"Challan not found\"}");
            }
            
            // Update fields with null checks
            if (updatedChallan.getDate() != null) {
                existing.setDate(updatedChallan.getDate());
            }
            if (updatedChallan.getFuelType() != null) {
                existing.setFuelType(updatedChallan.getFuelType());
            }
            if (updatedChallan.getQuantity() != null) {
                existing.setQuantity(updatedChallan.getQuantity());
            }
            if (updatedChallan.getPricePerLiter() != null) {
                existing.setPricePerLiter(updatedChallan.getPricePerLiter());
            }
            if (updatedChallan.getTotalAmount() != null) {
                existing.setTotalAmount(updatedChallan.getTotalAmount());
            }
            if (updatedChallan.getVendorName() != null) {
                existing.setVendorName(updatedChallan.getVendorName());
            }
            if (updatedChallan.getChallanNumber() != null) {
                existing.setChallanNumber(updatedChallan.getChallanNumber());
            }

            Challan saved = challanService.saveChallan(existing);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Update Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to update challan\"}");
        }
    }

    /**
     * Delete challan
     * DELETE http://localhost:8080/api/challans/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChallan(@PathVariable Long id) {
        try {
            Challan existing = challanService.findById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\": \"Challan not found\"}");
            }
            
            challanService.deleteById(id);
            return ResponseEntity.ok("{\"message\": \"Challan deleted successfully\"}");
        } catch (Exception e) {
            System.err.println("Delete Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to delete challan\"}");
        }
    }

    /**
     * Get challan by ID
     * GET http://localhost:8080/api/challans/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getChallanById(@PathVariable Long id) {
        try {
            Challan challan = challanService.findById(id);
            if (challan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\": \"Challan not found\"}");
            }
            return ResponseEntity.ok(challan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
