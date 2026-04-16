package model;

public class Doctor extends Person {
    private int doctorId;
    private String specialization;
    private String status = "Active";

    public Doctor(int doctorId, String name, int age, String specialization) {
        super(name, age);
        this.doctorId = doctorId;
        this.specialization = specialization;
        this.status = "Active";
    }

    public Doctor(int doctorId, String name, int age, String specialization, String status) {
        super(name, age);
        this.doctorId = doctorId;
        this.specialization = specialization;
        this.status = status != null ? status : "Active";
    }

    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public void displayInfo() {
        System.out.println("Doctor ID: " + doctorId +
                ", Name: " + name +
                ", Age: " + age +
                ", Specialization: " + specialization);
    }
}
