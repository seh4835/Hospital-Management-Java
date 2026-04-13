package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.Patient;
import org.bson.Document;
import util.MongoDBConnection;
import java.util.ArrayList;
import java.util.List;

public class PatientDAO {
    private MongoCollection<Document> collection;

    public PatientDAO() {
        MongoDatabase database = MongoDBConnection.getDatabase();
        collection = database.getCollection("patients");
    }

    // ---------------- EXISTENCE CHECK ----------------
    public boolean exists(int id) {
        return collection.find(new Document("patientId", id)).first() != null;
    }

    // ---------------- AUTO-ID GENERATION ----------------
    public int getNextId() {
        Document lastDoc = collection.find().sort(new Document("patientId", -1)).first();
        if (lastDoc == null) return 1;
        return lastDoc.getInteger("patientId") + 1;
    }

    // ---------------- CREATE ----------------
    public void addPatient(Patient patient) {
        Document existing = collection.find(
                new Document("patientId", patient.getPatientId())).first();

        if (existing != null) {
            System.out.println("Patient already exists!");
            return;
        }

        Document doc = new Document("patientId", patient.getPatientId())
                .append("name", patient.getName())
                .append("age", patient.getAge())
                .append("disease", patient.getDisease());

        collection.insertOne(doc);
        System.out.println("Patient added successfully!");
    }

    // ---------------- READ ----------------
    public void getAllPatients() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    // ---------------- COLLECTION USAGE ----------------
    public List<Document> getPatientsList() {
        List<Document> list = new ArrayList<>();
        for (Document doc : collection.find()) {
            list.add(doc);
        }
        return list;
    }

    // ---------------- UPDATE ----------------
    public void updatePatient(int id, String newDisease) {
        collection.updateOne(
                new Document("patientId", id),
                new Document("$set", new Document("disease", newDisease)));
        System.out.println("Patient updated successfully!");
    }

    // ---------------- DELETE ----------------
    public void deletePatient(int id) {
        collection.deleteOne(new Document("patientId", id));
        System.out.println("Patient deleted successfully!");
    }

    // ---------------- SEARCH BY ID ----------------
    public void searchPatient(int id) {
        Document doc = collection.find(new Document("patientId", id)).first();

        if (doc != null) {
            System.out.println(doc.toJson());
        } else {
            System.out.println("Patient not found!");
        }
    }

    // ---------------- SEARCH BY NAME ----------------
    public void searchPatientByName(String name) {
        boolean found = false;

        for (Document doc : collection.find(new Document("name", name))) {
            System.out.println(doc.toJson());
            found = true;
        }

        if (!found) {
            System.out.println("No patient found with this name!");
        }
    }

    // ---------------- SEARCH BY DISEASE ----------------
    public void searchPatientByDisease(String disease) {
        boolean found = false;

        for (Document doc : collection.find(new Document("disease", disease))) {
            System.out.println(doc.toJson());
            found = true;
        }

        if (!found) {
            System.out.println("No patient found with this disease!");
        }
    }
}
