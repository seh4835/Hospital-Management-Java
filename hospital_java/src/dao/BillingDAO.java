package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.Bill;
import org.bson.Document;
import util.MongoDBConnection;

public class BillingDAO {

    private MongoCollection<Document> collection;

    public BillingDAO() {
        MongoDatabase db = MongoDBConnection.getDatabase();
        collection = db.getCollection("billing");
    }

    // ---------------- CHECK EXISTENCE ----------------
    public boolean exists(int id) {
        return collection.find(new Document("billId", id)).first() != null;
    }

    // ---------------- ADD BILL ----------------
    public void addBill(Bill bill) {

        if (exists(bill.getBillId())) {
            System.out.println("Bill already exists!");
            return;
        }

        if (bill.getAmount() <= 0) {
            System.out.println("Invalid amount!");
            return;
        }

        Document doc = new Document("billId", bill.getBillId())
                .append("patientName", bill.getPatientName())
                .append("treatment", bill.getTreatment())
                .append("amount", bill.getAmount())
                .append("insuranceStatus", bill.getInsuranceStatus());

        collection.insertOne(doc);
        System.out.println("Bill added successfully!");
    }

    // ---------------- VIEW ALL BILLS ----------------
    public void getAllBills() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    // ---------------- GET BILLS LIST ----------------
    public java.util.List<Document> getBillsList() {
        return collection.find().into(new java.util.ArrayList<>());
    }

    // ---------------- SEARCH BY BILL ID ----------------
    public void searchBill(int id) {

        Document doc = collection.find(
                new Document("billId", id)).first();

        if (doc != null) {
            System.out.println(doc.toJson());
        } else {
            System.out.println("Bill not found!");
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
            System.out.println("No bills found for this patient!");
        }
    }

    // ---------------- UPDATE BILL ----------------
    public void updateBill(int id, double newAmount, String newStatus) {

        if (!exists(id)) {
            System.out.println("Bill not found!");
            return;
        }

        if (newAmount <= 0) {
            System.out.println("Invalid amount!");
            return;
        }

        collection.updateOne(
                new Document("billId", id),
                new Document("$set", new Document("amount", newAmount)
                        .append("insuranceStatus", newStatus)));

        System.out.println("Bill updated successfully!");
    }

    // ---------------- DELETE BILL ----------------
    public void deleteBill(int id) {

        if (!exists(id)) {
            System.out.println("Bill not found!");
            return;
        }

        collection.deleteOne(new Document("billId", id));

        System.out.println("Bill deleted successfully!");
    }
}