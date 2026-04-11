package model;

public class Bill {

    private int billId;
    private String patientName;
    private String treatment;
    private double amount;
    private String insuranceStatus;

    public Bill(int billId, String patientName, String treatment, double amount, String insuranceStatus) {
        this.billId = billId;
        this.patientName = patientName;
        this.treatment = treatment;
        this.amount = amount;
        this.insuranceStatus = insuranceStatus;
    }

    public int getBillId() {
        return billId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getTreatment() {
        return treatment;
    }

    public double getAmount() {
        return amount;
    }

    public String getInsuranceStatus() {
        return insuranceStatus;
    }
}