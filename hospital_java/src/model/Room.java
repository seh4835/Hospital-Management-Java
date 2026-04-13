package model;

public class Room {

    private int roomId;
    private boolean isOccupied;
    private String roomType; // "BED" or "OT"

    public Room(int roomId, boolean isOccupied, String roomType) {
        this.roomId = roomId;
        this.isOccupied = isOccupied;
        this.roomType = roomType;
    }

    public int getRoomId() {
        return roomId;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    public void setOccupied(boolean occupied) {
        isOccupied = occupied;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }
}