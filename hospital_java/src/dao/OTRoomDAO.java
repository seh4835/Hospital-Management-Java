package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.OTRoom;
import org.bson.Document;
import util.MongoDBConnection;
import java.util.ArrayList;
import java.util.List;

public class OTRoomDAO {
    private MongoCollection<Document> collection;

    public OTRoomDAO() {
        MongoDatabase db = MongoDBConnection.getDatabase();
        collection = db.getCollection("ot_rooms");
    }

    public boolean exists(int id) {
        return collection.find(new Document("roomId", id)).first() != null;
    }

    public int getNextId() {
        Document lastDoc = collection.find().sort(new Document("roomId", -1)).first();
        if (lastDoc == null) return 1;
        return lastDoc.getInteger("roomId") + 1;
    }

    public void addOTRoom(OTRoom room) {
        if (exists(room.getRoomId())) return;
        Document doc = new Document("roomId", room.getRoomId())
                .append("occupied", room.isOccupied())
                .append("patientName", room.getPatientName());
        collection.insertOne(doc);
    }

    public List<Document> getOTRoomsList() {
        return collection.find().into(new ArrayList<>());
    }

    public void assignRoom(int id, String occupantName) {
        collection.updateOne(
                new Document("roomId", id),
                new Document("$set", new Document("occupied", true).append("patientName", occupantName))
        );
    }

    public void freeRoom(int id) {
        collection.updateOne(
                new Document("roomId", id),
                new Document("$set", new Document("occupied", false).append("patientName", ""))
        );
    }

    public boolean isOccupied(int id) {
        Document doc = collection.find(new Document("roomId", id)).first();
        return doc != null && doc.getBoolean("occupied");
    }

    public int getAvailableOTId() {
        Document doc = collection.find(new Document("occupied", false)).first();
        return doc != null ? doc.getInteger("roomId") : -1;
    }
}
