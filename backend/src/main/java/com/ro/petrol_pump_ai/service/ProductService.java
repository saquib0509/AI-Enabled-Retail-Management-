package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.Product;
import com.ro.petrol_pump_ai.dto.ProductResponse;
import com.ro.petrol_pump_ai.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToResponse(product);
    }

    public ProductResponse getProductByName(String name) {
        Product product = productRepository.findByName(name)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToResponse(product);
    }

    public ProductResponse createProduct(String name, String unit) {
        Product product = new Product();
        product.setName(name);
        product.setUnit(unit);
        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }

    // UPDATE PRODUCT
public ProductResponse updateProduct(Long id, String name, String unit) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    
    product.setName(name);
    product.setUnit(unit);
    
    Product updatedProduct = productRepository.save(product);
    return new ProductResponse(updatedProduct.getId(), updatedProduct.getName(), updatedProduct.getUnit());
}

// DELETE PRODUCT
public void deleteProduct(Long id) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    
    productRepository.delete(product);
}


    @Transactional
    public void initializeDefaultProducts() {
        long count = productRepository.count();
        System.out.println("Current product count in database: " + count);
        
        if (count == 0) {
            System.out.println("Initializing default products...");
            List<Product> defaultProducts = Arrays.asList(
                new Product(null, "Petrol", "Lts", null, null),
                new Product(null, "Diesel", "Lts", null, null),
                new Product(null, "CNG", "Kg", null, null),
                new Product(null, "XP95", "Lts", null, null)
            );
            
            List<Product> savedProducts = productRepository.saveAll(defaultProducts);
            System.out.println("Successfully initialized " + savedProducts.size() + " default products");
        } else {
            System.out.println("Products already exist in database. Skipping initialization.");
        }
    }

    private ProductResponse convertToResponse(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getUnit()
        );
    }
}
