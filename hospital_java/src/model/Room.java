package model;

public class Room {

    private int roomId;
    private boolean isOccupied;

    public Room(int roomId, boolean isOccupied) {
        this.roomId = roomId;
        this.isOccupied = isOccupied;
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
}