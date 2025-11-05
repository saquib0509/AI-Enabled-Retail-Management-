package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.Employee;
import com.ro.petrol_pump_ai.dto.EmployeeRequest;
import com.ro.petrol_pump_ai.dto.EmployeeResponse;
import com.ro.petrol_pump_ai.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setPhone(request.getPhone());
        employee.setEmail(request.getEmail());
        employee.setRole(request.getRole());
        employee.setStatus(request.getStatus());

        Employee savedEmployee = employeeRepository.save(employee);
        return convertToResponse(savedEmployee);
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        return convertToResponse(employee);
    }

    public List<EmployeeResponse> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<EmployeeResponse> getEmployeesByRole(String role) {
        List<Employee> employees = employeeRepository.findByRole(role);
        return employees.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<EmployeeResponse> getEmployeesByStatus(String status) {
        List<Employee> employees = employeeRepository.findByStatus(status);
        return employees.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setName(request.getName());
        employee.setPhone(request.getPhone());
        employee.setEmail(request.getEmail());
        employee.setRole(request.getRole());
        employee.setStatus(request.getStatus());

        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToResponse(updatedEmployee);
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found");
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeResponse convertToResponse(Employee employee) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return new EmployeeResponse(
            employee.getId(),
            employee.getName(),
            employee.getPhone(),
            employee.getEmail(),
            employee.getRole(),
            employee.getHireDate(),
            employee.getStatus(),
            employee.getCreatedAt() != null ? employee.getCreatedAt().toString() : null
        );
    }
}
