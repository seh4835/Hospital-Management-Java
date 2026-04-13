package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.Bed;
import org.bson.Document;
import util.MongoDBConnection;
import java.util.ArrayList;
import java.util.List;

public class BedDAO {
    private MongoCollection<Document> collection;

    public BedDAO() {
        MongoDatabase db = MongoDBConnection.getDatabase();
        collection = db.getCollection("beds");
    }

    public boolean exists(int id) {
        return collection.find(new Document("bedId", id)).first() != null;
    }

    public int getNextId() {
        Document lastDoc = collection.find().sort(new Document("bedId", -1)).first();
        if (lastDoc == null) return 1;
        return lastDoc.getInteger("bedId") + 1;
    }

    public void addBed(Bed bed) {
        if (exists(bed.getBedId())) return;
        Document doc = new Document("bedId", bed.getBedId())
                .append("occupied", bed.isOccupied())
                .append("patientName", bed.getPatientName());
        collection.insertOne(doc);
    }

    public List<Document> getBedsList() {
        return collection.find().into(new ArrayList<>());
    }

    public void assignBed(int id, String patientName) {
        collection.updateOne(
                new Document("bedId", id),
                new Document("$set", new Document("occupied", true).append("patientName", patientName))
        );
    }

    public void freeBed(int id) {
        collection.updateOne(
                new Document("bedId", id),
                new Document("$set", new Document("occupied", false).append("patientName", ""))
        );
    }

    public int getAvailableBedId() {
        Document doc = collection.find(new Document("occupied", false)).first();
        return doc != null ? doc.getInteger("bedId") : -1;
    }

    public int getBedByPatient(String name) {
        Document doc = collection.find(new Document("patientName", name)).first();
        return doc != null ? doc.getInteger("bedId") : -1;
    }

    public boolean isOccupied(int id) {
        Document doc = collection.find(new Document("bedId", id)).first();
        return doc != null && doc.getBoolean("occupied");
    }
}
