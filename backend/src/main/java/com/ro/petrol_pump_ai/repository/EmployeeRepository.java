package com.ro.petrol_pump_ai.repository;

import com.ro.petrol_pump_ai.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByPhone(String phone);
    
    List<Employee> findByStatus(String status);
    
    List<Employee> findByRole(String role);
    
    List<Employee> findAll();
}
