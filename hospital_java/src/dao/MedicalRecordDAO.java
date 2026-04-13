package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.MedicalRecord;
import org.bson.Document;
import util.MongoDBConnection;

public class MedicalRecordDAO {

    private MongoCollection<Document> collection;

    public MedicalRecordDAO() {
        MongoDatabase db = MongoDBConnection.getDatabase();
        collection = db.getCollection("records");
    }

    // ---------------- CHECK EXISTENCE ----------------
    public boolean exists(int id) {
        return collection.find(new Document("recordId", id)).first() != null;
    }

    // ---------------- AUTO-ID GENERATION ----------------
    public int getNextId() {
        Document lastDoc = collection.find().sort(new Document("recordId", -1)).first();
        if (lastDoc == null) return 1;
        return lastDoc.getInteger("recordId") + 1;
    }

    // ---------------- ADD RECORD ----------------
    public void addRecord(MedicalRecord record) {

        if (exists(record.getRecordId())) {
            System.out.println("Record already exists!");
            return;
        }

        Document doc = new Document("recordId", record.getRecordId())
                .append("patientName", record.getPatientName())
                .append("doctorName", record.getDoctorName())
                .append("diagnosis", record.getDiagnosis())
                .append("treatment", record.getTreatment())
                .append("date", record.getDate());

        collection.insertOne(doc);
        System.out.println("Medical record added successfully!");
    }

    // ---------------- VIEW ALL RECORDS ----------------
    public void getAllRecords() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    // ---------------- GET RECORDS LIST ----------------
    public java.util.List<Document> getRecordsList() {
        java.util.List<Document> list = new java.util.ArrayList<>();
        for (Document doc : collection.find()) {
            list.add(doc);
        }
        return list;
    }

    // ---------------- SEARCH BY RECORD ID ----------------
    public void searchRecord(int id) {

        Document doc = collection.find(
                new Document("recordId", id)).first();

        if (doc != null) {
            System.out.println(doc.toJson());
        } else {
            System.out.println("Record not found!");
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
            System.out.println("No records found for this patient!");
        }
    }

    // ---------------- UPDATE RECORD ----------------
    public void updateRecord(int id, String newDiagnosis, String newTreatment) {

        if (!exists(id)) {
            System.out.println("Record not found!");
            return;
        }

        collection.updateOne(
                new Document("recordId", id),
                new Document("$set", new Document("diagnosis", newDiagnosis)
                        .append("treatment", newTreatment)));

        System.out.println("Record updated successfully!");
    }

    // ---------------- DELETE RECORD ----------------
    public void deleteRecord(int id) {

        if (!exists(id)) {
            System.out.println("Record not found!");
            return;
        }

        collection.deleteOne(new Document("recordId", id));

        System.out.println("Record deleted successfully!");
    }
}