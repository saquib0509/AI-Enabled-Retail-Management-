package com.ro.petrol_pump_ai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "salary_structure")
public class SalaryStructure {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "employee_id", nullable = false, unique = true)
    private Long employeeId;
    
    @Column(name = "base_salary", nullable = false)
    private Double baseSalary;
    
    @Column(name = "hra")
    private Double hra = 0.0; // House Rent Allowance
    
    @Column(name = "dearness_allowance")
    private Double dearnessAllowance = 0.0; // DA
    
    @Column(name = "other_allowances")
    private Double otherAllowances = 0.0;
    
    @Column(name = "pf_deduction")
    private Double pfDeduction = 0.0; // Provident Fund
    
    @Column(name = "tax_deduction")
    private Double taxDeduction = 0.0;
    
    @Column(name = "other_deductions")
    private Double otherDeductions = 0.0;
    
    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
    
    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt = java.time.LocalDateTime.now();
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    
    public Double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }
    
    public Double getHra() { return hra; }
    public void setHra(Double hra) { this.hra = hra; }
    
    public Double getDearnessAllowance() { return dearnessAllowance; }
    public void setDearnessAllowance(Double dearnessAllowance) { this.dearnessAllowance = dearnessAllowance; }
    
    public Double getOtherAllowances() { return otherAllowances; }
    public void setOtherAllowances(Double otherAllowances) { this.otherAllowances = otherAllowances; }
    
    public Double getPfDeduction() { return pfDeduction; }
    public void setPfDeduction(Double pfDeduction) { this.pfDeduction = pfDeduction; }
    
    public Double getTaxDeduction() { return taxDeduction; }
    public void setTaxDeduction(Double taxDeduction) { this.taxDeduction = taxDeduction; }
    
    public Double getOtherDeductions() { return otherDeductions; }
    public void setOtherDeductions(Double otherDeductions) { this.otherDeductions = otherDeductions; }
    
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}
