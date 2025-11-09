package com.ro.petrol_pump_ai.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.ro.petrol_pump_ai.dto.ChallanExtractedData;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;
import java.time.LocalDate;

@Service
public class AIExtractorService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.model}")
    private String model;

    @Autowired
    private FuelTypeMapper fuelTypeMapper;

    private final Gson gson = new Gson();

    public ChallanExtractedData refineWithAI(String rawOCRText) {
        try {
            String aiResponse = callGemini(rawOCRText);
            System.out.println("Gemini Response:\n" + aiResponse);
            return parseAIResponse(aiResponse, rawOCRText);
        } catch (Exception e) {
            System.err.println("AI extraction failed: " + e.getMessage());
            e.printStackTrace();
            ChallanExtractedData data = new ChallanExtractedData();
            data.setRawText(rawOCRText);
            data.setConfidence(0.0);
            return data;
        }
    }

    private String callGemini(String rawOCRText) throws Exception {
        String prompt = "Extract fuel invoice data from this text. Return ONLY valid JSON (no markdown, no code blocks):\n{\n  \"date\": \"YYYY-MM-DD or null\",\n  \"fuelType\": \"Petrol or Diesel or XP95 or null\",\n  \"quantity\": 0.0,\n  \"pricePerLiter\": 0.0,\n  \"totalAmount\": 0.0,\n  \"vendorName\": \"string or null\",\n  \"challanNumber\": \"string or null\"\n}\n\nINVOICE TEXT:\n" + rawOCRText;

        JsonObject requestBody = new JsonObject();
        
        JsonArray contents = new JsonArray();
        JsonObject content = new JsonObject();
        content.addProperty("role", "user");
        
        JsonArray parts = new JsonArray();
        JsonObject part = new JsonObject();
        part.addProperty("text", prompt);
        parts.add(part);
        
        content.add("parts", parts);
        contents.add(content);
        
        requestBody.add("contents", contents);

        OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

        RequestBody body = RequestBody.create(requestBody.toString(), MediaType.parse("application/json"));

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;
        
        Request request = new Request.Builder()
            .url(url)
            .header("Content-Type", "application/json")
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "No response";
            System.out.println("Gemini Status: " + response.code());
            System.out.println("Response: " + responseBody);

            if (!response.isSuccessful()) {
                throw new Exception("Gemini API error: " + response.code() + " - " + responseBody);
            }
            return responseBody;
        }
    }

    private ChallanExtractedData parseAIResponse(String jsonResponse, String rawOCRText) {
        try {
            JsonObject geminiResponse = gson.fromJson(jsonResponse, JsonObject.class);

            String messageContent = geminiResponse
                .getAsJsonArray("candidates")
                .get(0)
                .getAsJsonObject()
                .getAsJsonObject("content")
                .getAsJsonArray("parts")
                .get(0)
                .getAsJsonObject()
                .get("text")
                .getAsString();

            System.out.println("Raw Message: " + messageContent);

            // Remove markdown code blocks
            String cleanJson = messageContent
                .replaceAll("`{3}(json)?", "")
                .replaceAll("json\\n", "")
                .trim();

            System.out.println("Clean JSON:\n" + cleanJson);

            // Parse JSON - could be object or array
            com.google.gson.JsonElement element = gson.fromJson(cleanJson, com.google.gson.JsonElement.class);
            JsonObject jsonData;

            if (element.isJsonArray()) {
                jsonData = element.getAsJsonArray().get(0).getAsJsonObject();
                System.out.println("Got first item from array");
            } else {
                jsonData = element.getAsJsonObject();
            }

            ChallanExtractedData data = new ChallanExtractedData();
            
            // Parse date safely
            if (jsonData.has("date") && !jsonData.get("date").isJsonNull()) {
                try {
                    String dateStr = jsonData.get("date").getAsString();
                    data.setDate(LocalDate.parse(dateStr));
                } catch (Exception e) {
                    System.out.println("Date parse error: " + e.getMessage());
                }
            }
            
            // Parse quantity
            Double quantity = null;
            String unit = "L";
            if (jsonData.has("quantity") && !jsonData.get("quantity").isJsonNull()) {
                quantity = jsonData.get("quantity").getAsDouble();
            }
            
            // Extract unit from raw text (KL or L)
            if (rawOCRText != null) {
                unit = extractUnitFromText(rawOCRText);
            }
            
            // Convert KL to Liters if needed
            if (quantity != null) {
                quantity = fuelTypeMapper.convertKLToLiters(quantity, unit);
                data.setQuantity(quantity);
            }
            
            // Parse price per liter
            if (jsonData.has("pricePerLiter") && !jsonData.get("pricePerLiter").isJsonNull()) {
                data.setPricePerLiter(jsonData.get("pricePerLiter").getAsDouble());
            }
            
            // Parse total amount
            if (jsonData.has("totalAmount") && !jsonData.get("totalAmount").isJsonNull()) {
                data.setTotalAmount(jsonData.get("totalAmount").getAsDouble());
            }
            
            // Parse vendor name
            if (jsonData.has("vendorName") && !jsonData.get("vendorName").isJsonNull()) {
                data.setVendorName(jsonData.get("vendorName").getAsString());
            }
            
            // Parse challan number
            if (jsonData.has("challanNumber") && !jsonData.get("challanNumber").isJsonNull()) {
                data.setChallanNumber(jsonData.get("challanNumber").getAsString());
            }

            // Map fuel type using FuelTypeMapper (handles codes like 50700, 16730, etc)
            String fuelType = null;
            if (jsonData.has("fuelType") && !jsonData.get("fuelType").isJsonNull()) {
                fuelType = jsonData.get("fuelType").getAsString();
            }
            
            // If fuel type is null or unknown, try to extract from raw text
            if (fuelType == null || fuelType.equals("null") || fuelType.isEmpty()) {
                fuelType = fuelTypeMapper.mapFuelType(rawOCRText);
            } else {
                // Also try to map if it's a code like "50700"
                String mappedType = fuelTypeMapper.mapFuelType(fuelType);
                if (!mappedType.equals("UNKNOWN")) {
                    fuelType = mappedType;
                }
            }
            
            data.setFuelType(fuelType);

            // Calculate confidence
            int filled = 0;
            if (data.getDate() != null) filled++;
            if (data.getFuelType() != null && !data.getFuelType().equals("UNKNOWN")) filled++;
            if (data.getQuantity() != null && data.getQuantity() > 0) filled++;
            if (data.getPricePerLiter() != null && data.getPricePerLiter() > 0) filled++;
            if (data.getTotalAmount() != null && data.getTotalAmount() > 0) filled++;
            if (data.getVendorName() != null && !data.getVendorName().isEmpty()) filled++;
            if (data.getChallanNumber() != null && !data.getChallanNumber().isEmpty()) filled++;

            data.setConfidence((filled / 7.0) * 100);
            data.setRawText(rawOCRText);
            
            System.out.println("Parsed data: " + data);
            
            return data;

        } catch (Exception e) {
            System.err.println("Parse error: " + e.getMessage());
            e.printStackTrace();
            ChallanExtractedData data = new ChallanExtractedData();
            data.setRawText(jsonResponse);
            data.setFuelType("UNKNOWN");
            data.setConfidence(0.0);
            return data;
        }
    }

    private String extractUnitFromText(String text) {
        if (text == null) return "L";
        String textUpper = text.toUpperCase();
        if (textUpper.contains("KL")) return "KL";
        if (textUpper.contains("KILOLITER")) return "KL";
        return "L";
    }
}
