package com.ro.petrol_pump_ai.dto;

public class SalaryStructureRequest {
    private Long employeeId;
    private Double baseSalary;
    private Double hra;
    private Double dearnessAllowance;
    private Double otherAllowances;
    private Double pfDeduction;
    private Double taxDeduction;
    private Double otherDeductions;
    
    // Getters and Setters
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
}
