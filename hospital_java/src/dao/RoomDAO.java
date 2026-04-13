package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import util.MongoDBConnection;

public class RoomDAO {

    private MongoCollection<Document> collection;

    public RoomDAO() {
        MongoDatabase db = MongoDBConnection.getDatabase();
        collection = db.getCollection("rooms");
    }

    // ---------------- CHECK IF ROOM EXISTS ----------------
    public boolean exists(int roomId) {
        return collection.find(new Document("roomId", roomId)).first() != null;
    }

    // ---------------- ADD ROOM ----------------
    public void addRoom(int roomId, String roomType) {

        if (exists(roomId)) {
            System.out.println("Room already exists!");
            return;
        }

        Document doc = new Document("roomId", roomId)
                .append("occupied", false)
                .append("patientName", "")
                .append("roomType", roomType);

        collection.insertOne(doc);
        System.out.println("Room added successfully!");
    }

    // ---------------- VIEW ALL ROOMS ----------------
    public void viewRooms() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    // ---------------- GET ALL ROOMS LIST ----------------
    public java.util.List<Document> getRoomsList() {
        java.util.List<Document> list = new java.util.ArrayList<>();
        for (Document doc : collection.find()) {
            list.add(doc);
        }
        return list;
    }

    // ---------------- GET ROOMS BY TYPE ----------------
    public java.util.List<Document> getRoomsByType(String type) {
        java.util.List<Document> list = new java.util.ArrayList<>();
        for (Document doc : collection.find(new Document("roomType", type))) {
            list.add(doc);
        }
        return list;
    }

    // ---------------- CHECK IF ROOM IS OCCUPIED ----------------
    public boolean isOccupied(int roomId) {

        Document room = collection.find(new Document("roomId", roomId)).first();

        if (room == null) {
            System.out.println("Room not found!");
            return false;
        }

        return room.getBoolean("occupied");
    }

    // ---------------- GET ROOM TYPE ----------------
    public String getRoomType(int roomId) {
        Document room = collection.find(new Document("roomId", roomId)).first();
        if (room == null) return null;
        return room.getString("roomType");
    }

    // ---------------- ASSIGN ROOM ----------------
    public void assignRoom(int roomId, String patientName) {

        if (!exists(roomId)) {
            System.out.println("Room does not exist!");
            return;
        }

        if (isOccupied(roomId)) {
            System.out.println("Room is already occupied!");
            return;
        }

        collection.updateOne(
                new Document("roomId", roomId),
                new Document("$set", new Document("occupied", true)
                        .append("patientName", patientName)));

        System.out.println("Room assigned to " + patientName);
    }

    // ---------------- FREE ROOM ----------------
    public void freeRoom(int roomId) {

        if (!exists(roomId)) {
            System.out.println("Room does not exist!");
            return;
        }

        collection.updateOne(
                new Document("roomId", roomId),
                new Document("$set", new Document("occupied", false)
                        .append("patientName", "")));

        System.out.println("Room freed successfully!");
    }

    // ---------------- FIND FIRST FREE BED ----------------
    public int getAvailableBed() {
        Document room = collection.find(
                new Document("occupied", false).append("roomType", "BED")
        ).first();

        if (room != null) {
            return room.getInteger("roomId");
        }

        return -1;
    }

    // ---------------- FIND FIRST FREE OT ROOM ----------------
    public int getAvailableOT() {
        Document room = collection.find(
                new Document("occupied", false).append("roomType", "OT")
        ).first();

        if (room != null) {
            return room.getInteger("roomId");
        }

        return -1;
    }

    // ---------------- FIND FIRST FREE ROOM (any type - legacy) ----------------
    public int getAvailableRoom() {
        Document room = collection.find(new Document("occupied", false)).first();

        if (room != null) {
            return room.getInteger("roomId");
        }

        return -1;
    }

    // ---------------- GET ROOM BY PATIENT (FOR DISCHARGE) ----------------
    public int getRoomByPatient(String name) {

        Document room = collection.find(
                new Document("patientName", name)).first();

        if (room != null) {
            return room.getInteger("roomId");
        }

        return -1;
    }

    // ---------------- FIND ROOM BY PATIENT (DISPLAY) ----------------
    public void findRoomByPatient(String name) {

        Document room = collection.find(
                new Document("patientName", name)).first();

        if (room != null) {
            System.out.println("Patient " + name + " is in room: " + room.getInteger("roomId"));
        } else {
            System.out.println("No room assigned to this patient.");
        }
    }
}