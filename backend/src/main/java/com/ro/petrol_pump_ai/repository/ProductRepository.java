package com.ro.petrol_pump_ai.repository;

import com.ro.petrol_pump_ai.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Custom query methods can be added here if needed
    Optional<Product> findByName(String name);
}
