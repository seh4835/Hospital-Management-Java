package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.Doctor;
import org.bson.Document;
import util.MongoDBConnection;
import java.util.ArrayList;
import java.util.List;

public class DoctorDAO {

    private MongoCollection<Document> collection;

    public DoctorDAO() {
        MongoDatabase database = MongoDBConnection.getDatabase();
        collection = database.getCollection("doctors");
    }

    // ---------------- EXISTENCE CHECK ----------------
    public boolean exists(int id) {
        return collection.find(new Document("doctorId", id)).first() != null;
    }

    // ---------------- ADD ----------------
    public void addDoctor(Doctor doctor) {

        if (exists(doctor.getDoctorId())) {
            System.out.println("Doctor already exists!");
            return;
        }

        Document doc = new Document("doctorId", doctor.getDoctorId())
                .append("name", doctor.getName())
                .append("age", doctor.getAge())
                .append("specialization", doctor.getSpecialization());

        collection.insertOne(doc);
        System.out.println("Doctor added successfully!");
    }

    // ---------------- VIEW ----------------
    public void getAllDoctors() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    // ---------------- COLLECTION USAGE ----------------
    public List<Document> getDoctorsList() {
        List<Document> list = new ArrayList<>();
        for (Document doc : collection.find()) {
            list.add(doc);
        }
        return list;
    }

    // ---------------- DELETE ----------------
    public void deleteDoctor(int id) {
        Document result = collection.findOneAndDelete(
                new Document("doctorId", id));

        if (result != null) {
            System.out.println("Doctor deleted successfully!");
        } else {
            System.out.println("Doctor not found!");
        }
    }

    // ---------------- SEARCH BY NAME ----------------
    public void searchDoctorByName(String name) {

        boolean found = false;

        for (Document doc : collection.find(new Document("name", name))) {
            System.out.println(doc.toJson());
            found = true;
        }

        if (!found) {
            System.out.println("No doctor found with this name!");
        }
    }

    // ---------------- SEARCH BY SPECIALIZATION ----------------
    public void searchDoctorBySpecialization(String spec) {

        boolean found = false;

        for (Document doc : collection.find(new Document("specialization", spec))) {
            System.out.println(doc.toJson());
            found = true;
        }

        if (!found) {
            System.out.println("No doctor found with this specialization!");
        }
    }
}