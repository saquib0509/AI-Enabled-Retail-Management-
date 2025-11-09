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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
public class AIExtractorService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.model}")
    private String model;

    private final Gson gson = new Gson();

    public ChallanExtractedData refineWithAI(String rawOCRText) {
        try {
            String aiResponse = callGemini(rawOCRText);
            System.out.println("Gemini Response:\n" + aiResponse);
            return parseAIResponse(aiResponse);
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
        String prompt = "Extract fuel invoice data from this text. Return ONLY valid JSON (no markdown, no code blocks):\n{\n  \"date\": \"YYYY-MM-DD or null\",\n  \"fuelType\": \"Petrol or Diesel or null\",\n  \"quantity\": 0.0,\n  \"pricePerLiter\": 0.0,\n  \"totalAmount\": 0.0,\n  \"vendorName\": \"string or null\",\n  \"challanNumber\": \"string or null\"\n}\n\nINVOICE TEXT:\n" + rawOCRText;

        // Build Gemini API request - CORRECT FORMAT (no generation_config)
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

    private ChallanExtractedData parseAIResponse(String jsonResponse) {
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
            // If array, take the first item
            jsonData = element.getAsJsonArray().get(0).getAsJsonObject();
            System.out.println("Got first item from array");
        } else {
            // If object, use directly
            jsonData = element.getAsJsonObject();
        }

        ChallanExtractedData data = new ChallanExtractedData();
        
        // Parse date safely
        if (jsonData.has("date") && !jsonData.get("date").isJsonNull()) {
            try {
                String dateStr = jsonData.get("date").getAsString();
                data.setDate(java.time.LocalDate.parse(dateStr));
            } catch (Exception e) {
                System.out.println("Date parse error: " + e.getMessage());
            }
        }
        
        // Parse other fields
        if (jsonData.has("fuelType") && !jsonData.get("fuelType").isJsonNull()) {
            data.setFuelType(jsonData.get("fuelType").getAsString());
        }
        if (jsonData.has("quantity") && !jsonData.get("quantity").isJsonNull()) {
            data.setQuantity(jsonData.get("quantity").getAsDouble());
        }
        if (jsonData.has("pricePerLiter") && !jsonData.get("pricePerLiter").isJsonNull()) {
            data.setPricePerLiter(jsonData.get("pricePerLiter").getAsDouble());
        }
        if (jsonData.has("totalAmount") && !jsonData.get("totalAmount").isJsonNull()) {
            data.setTotalAmount(jsonData.get("totalAmount").getAsDouble());
        }
        if (jsonData.has("vendorName") && !jsonData.get("vendorName").isJsonNull()) {
            data.setVendorName(jsonData.get("vendorName").getAsString());
        }
        if (jsonData.has("challanNumber") && !jsonData.get("challanNumber").isJsonNull()) {
            data.setChallanNumber(jsonData.get("challanNumber").getAsString());
        }

        // Calculate confidence
        int filled = 0;
        if (data.getDate() != null) filled++;
        if (data.getFuelType() != null) filled++;
        if (data.getQuantity() != null && data.getQuantity() > 0) filled++;
        if (data.getPricePerLiter() != null && data.getPricePerLiter() > 0) filled++;
        if (data.getTotalAmount() != null && data.getTotalAmount() > 0) filled++;
        if (data.getVendorName() != null) filled++;
        if (data.getChallanNumber() != null) filled++;

        data.setConfidence((filled / 7.0) * 100);
        System.out.println("Parsed data: " + data);
        
        return data;

    } catch (Exception e) {
        System.err.println("Parse error: " + e.getMessage());
        e.printStackTrace();
        ChallanExtractedData data = new ChallanExtractedData();
        data.setRawText(jsonResponse);
        data.setConfidence(0.0);
        return data;
    }
}
}
