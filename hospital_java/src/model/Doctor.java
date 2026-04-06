package model;

public class Doctor extends Person {
    private int doctorId;
    private String specialization;

    public Doctor(int doctorId, String name, int age, String specialization) {
        super(name, age);
        this.doctorId = doctorId;
        this.specialization = specialization;
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

    @Override
    public void displayInfo() {
        System.out.println("Doctor ID: " + doctorId +
                ", Name: " + name +
                ", Age: " + age +
                ", Specialization: " + specialization);
    }
}
