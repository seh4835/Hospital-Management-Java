package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.Appointment;
import org.bson.Document;
import util.MongoDBConnection;
import java.util.ArrayList;
import java.util.List;

public class AppointmentDAO {

    private MongoCollection<Document> collection;

    public AppointmentDAO() {
        MongoDatabase database = MongoDBConnection.getDatabase();
        collection = database.getCollection("appointments");
    }

    // CHECK EXISTENCE
    public boolean exists(int id) {
        return collection.find(new Document("appointmentId", id)).first() != null;
    }

    // ---------------- CREATE ----------------
    public void addAppointment(Appointment a) {

        // Check duplicate appointment ID
        Document existing = collection.find(
                new Document("appointmentId", a.getAppointmentId())).first();

        if (existing != null) {
            System.out.println("Appointment already exists!");
            return;
        }

        // Insert appointment
        Document doc = new Document("appointmentId", a.getAppointmentId())
                .append("patientId", a.getPatientId())
                .append("doctorId", a.getDoctorId())
                .append("date", a.getDate());

        collection.insertOne(doc);
        System.out.println("Appointment booked successfully!");
    }

    // ---------------- READ ----------------
    public void getAllAppointments() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    public List<Document> getAppointmentsList() {
        List<Document> list = new ArrayList<>();
        for (Document doc : collection.find()) {
            list.add(doc);
        }
        return list;
    }

    // ---------------- DELETE ----------------
    public void deleteAppointment(int id) {
        Document result = collection.findOneAndDelete(
                new Document("appointmentId", id));

        if (result != null) {
            System.out.println("Appointment deleted successfully!");
        } else {
            System.out.println("Appointment not found!");
        }
    }

    // ---------------- SEARCH ----------------
    public void searchAppointment(int id) {
        Document doc = collection.find(
                new Document("appointmentId", id)).first();

        if (doc != null) {
            System.out.println(doc.toJson());
        } else {
            System.out.println("Appointment not found!");
        }
    }
}