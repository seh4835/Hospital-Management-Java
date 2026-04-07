package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.Patient;
import org.bson.Document;
import util.MongoDBConnection;

public class PatientDAO {
    private MongoCollection<Document> collection;
    
    public PatientDAO(){
        MongoDatabase database = MongoDBConnection.getDatabase();
        collection = database.getCollection("patients");
    }

    // CREATE (Add Patient)
    public void addPatient(Patient patient) {
        // Check if patient already exists
        Document existing = collection.find(
            new Document("patientId", patient.getPatientId())
        ).first();
        if (existing != null) {
            System.out.println("Patient already exists!");
            return;
        }

        // Create a new document for the patient
        Document doc = new Document("patientId", patient.getPatientId())
                .append("name", patient.getName())
                .append("age", patient.getAge())
                .append("disease", patient.getDisease());

        collection.insertOne(doc);
        System.out.println("Patient added successfully!");
    }

    // READ (View All Patients)
    public void getAllPatients() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    // UPDATE Patient
    public void updatePatient(int id, String newDisease) {
        collection.updateOne(
            new Document("patientId", id),
            new Document("$set", new Document("disease", newDisease))
        );
        System.out.println("Patient updated successfully!");
    }

    // DELETE Patient
    public void deletePatient(int id) {
        collection.deleteOne(new Document("patientId", id));
        System.out.println("Patient deleted successfully!");
    }

    // SEARCH Patient
    public void searchPatient(int id) {
        Document doc = collection.find(new Document("patientId", id)).first();
        
        if (doc != null) {
            System.out.println(doc.toJson());
        } else {
            System.out.println("Patient not found!");
        }
    }
}
