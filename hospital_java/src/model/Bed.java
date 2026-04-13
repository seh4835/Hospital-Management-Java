package model;

public class Bed {
    private int bedId;
    private boolean isOccupied;
    private String patientName;

    public Bed(int bedId, boolean isOccupied, String patientName) {
        this.bedId = bedId;
        this.isOccupied = isOccupied;
        this.patientName = patientName;
    }

    public int getBedId() { return bedId; }
    public boolean isOccupied() { return isOccupied; }
    public void setOccupied(boolean occupied) { isOccupied = occupied; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
}
