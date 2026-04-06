package model;

public class Patient extends Person {
    private int patientId;
    private String disease;

    public Patient(int patientId, String name, int age, String disease) {
        super(name, age);
        this.patientId = patientId;
        this.disease = disease;
    }

    // Getters & Setters
    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    // Method Overriding (Polymorphism)
    @Override
    public void displayInfo() {
        System.out.println("Patient ID: " + patientId +
                ", Name: " + name +
                ", Age: " + age +
                ", Disease: " + disease);
    }
}
