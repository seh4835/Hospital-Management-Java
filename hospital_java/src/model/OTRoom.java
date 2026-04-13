package model;

public class OTRoom {
    private int roomId;
    private boolean isOccupied;
    private String patientName;

    public OTRoom(int roomId, boolean isOccupied, String patientName) {
        this.roomId = roomId;
        this.isOccupied = isOccupied;
        this.patientName = patientName;
    }

    public int getRoomId() { return roomId; }
    public boolean isOccupied() { return isOccupied; }
    public void setOccupied(boolean occupied) { isOccupied = occupied; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
}
