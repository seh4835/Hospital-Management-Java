package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.TestRecord;
import org.bson.Document;
import util.MongoDBConnection;

public class LabDAO {

    private MongoCollection<Document> collection;

    public LabDAO() {
        MongoDatabase db = MongoDBConnection.getDatabase();
        collection = db.getCollection("tests");
    }

    // ---------------- CHECK EXISTENCE ----------------
    public boolean exists(int id) {
        return collection.find(new Document("testId", id)).first() != null;
    }

    // ---------------- AUTO-ID GENERATION ----------------
    public int getNextId() {
        Document lastDoc = collection.find().sort(new Document("testId", -1)).first();
        if (lastDoc == null) return 1;
        return lastDoc.getInteger("testId") + 1;
    }

    // ---------------- ADD TEST ----------------
    public void addTest(TestRecord test) {

        if (exists(test.getTestId())) {
            System.out.println("Test already exists!");
            return;
        }

        Document doc = new Document("testId", test.getTestId())
                .append("patientName", test.getPatientName())
                .append("testType", test.getTestType())
                .append("status", test.getStatus())
                .append("date", test.getDate())
                .append("time", test.getTime()); // ✅ NEW

        collection.insertOne(doc);
        System.out.println("Test record added successfully!");
    }

    // ---------------- VIEW ALL TESTS ----------------
    public void getAllTests() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    // ---------------- GET TESTS LIST ----------------
    public java.util.List<Document> getTestsList() {
        return collection.find().into(new java.util.ArrayList<>());
    }

    // ---------------- SEARCH BY TEST ID ----------------
    public void searchTest(int id) {

        Document doc = collection.find(
                new Document("testId", id)).first();

        if (doc != null) {
            System.out.println(doc.toJson());
        } else {
            System.out.println("Test not found!");
        }
    }

    // ---------------- SEARCH BY PATIENT ----------------
    public void searchByPatient(String name) {

        boolean found = false;

        for (Document doc : collection.find(new Document("patientName", name))) {
            System.out.println(doc.toJson());
            found = true;
        }

        if (!found) {
            System.out.println("No test records found!");
        }
    }

    // ---------------- UPDATE STATUS ----------------
    public void updateTest(int id, String newStatus) {

        if (!exists(id)) {
            System.out.println("Test not found!");
            return;
        }

        collection.updateOne(
                new Document("testId", id),
                new Document("$set", new Document("status", newStatus)));

        System.out.println("Test status updated successfully!");
    }

    // ---------------- DELETE TEST ----------------
    public void deleteTest(int id) {

        if (!exists(id)) {
            System.out.println("Test not found!");
            return;
        }

        collection.deleteOne(new Document("testId", id));

        System.out.println("Test deleted successfully!");
    }
}