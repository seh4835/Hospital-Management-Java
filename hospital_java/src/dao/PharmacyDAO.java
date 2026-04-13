package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.Medicine;
import org.bson.Document;
import util.MongoDBConnection;

public class PharmacyDAO {

    private MongoCollection<Document> collection;

    public PharmacyDAO() {
        MongoDatabase db = MongoDBConnection.getDatabase();
        collection = db.getCollection("medicines");
    }

    // ---------------- CHECK EXISTENCE ----------------
    public boolean exists(int id) {
        return collection.find(new Document("medicineId", id)).first() != null;
    }

    // ---------------- AUTO-ID GENERATION ----------------
    public int getNextId() {
        Document lastDoc = collection.find().sort(new Document("medicineId", -1)).first();
        if (lastDoc == null) return 1;
        return lastDoc.getInteger("medicineId") + 1;
    }

    // ---------------- ADD MEDICINE ----------------
    public void addMedicine(Medicine med) {

        if (exists(med.getMedicineId())) {
            System.out.println("Medicine already exists!");
            return;
        }

        if (med.getStock() < 0 || med.getPrice() <= 0) {
            System.out.println("Invalid stock or price!");
            return;
        }

        Document doc = new Document("medicineId", med.getMedicineId())
                .append("name", med.getName())
                .append("stock", med.getStock())
                .append("price", med.getPrice());

        collection.insertOne(doc);
        System.out.println("Medicine added successfully!");
    }

    // ---------------- VIEW ALL MEDICINES ----------------
    public void getAllMedicines() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    // ---------------- GET MEDICINES LIST ----------------
    public java.util.List<Document> getMedicinesList() {
        return collection.find().into(new java.util.ArrayList<>());
    }

    // ---------------- SEARCH BY ID ----------------
    public void searchMedicine(int id) {

        Document doc = collection.find(
                new Document("medicineId", id)).first();

        if (doc != null) {
            System.out.println(doc.toJson());
        } else {
            System.out.println("Medicine not found!");
        }
    }

    // ---------------- SEARCH BY NAME ----------------
    public void searchByName(String name) {

        boolean found = false;

        for (Document doc : collection.find(new Document("name", name))) {
            System.out.println(doc.toJson());
            found = true;
        }

        if (!found) {
            System.out.println("No medicine found!");
        }
    }

    // ---------------- UPDATE MEDICINE ----------------
    public void updateMedicine(int id, int newStock, double newPrice) {

        if (!exists(id)) {
            System.out.println("Medicine not found!");
            return;
        }

        if (newStock < 0 || newPrice <= 0) {
            System.out.println("Invalid values!");
            return;
        }

        collection.updateOne(
                new Document("medicineId", id),
                new Document("$set", new Document("stock", newStock)
                        .append("price", newPrice)));

        System.out.println("Medicine updated successfully!");
    }

    // ---------------- DELETE MEDICINE ----------------
    public void deleteMedicine(int id) {

        if (!exists(id)) {
            System.out.println("Medicine not found!");
            return;
        }

        collection.deleteOne(new Document("medicineId", id));

        System.out.println("Medicine deleted successfully!");
    }

    // ---------------- SELL MEDICINE (IMPORTANT) ----------------
    public void sellMedicine(int id, int quantity) {

        Document med = collection.find(
                new Document("medicineId", id)).first();

        if (med == null) {
            System.out.println("Medicine not found!");
            return;
        }

        int currentStock = med.getInteger("stock");

        if (quantity <= 0) {
            System.out.println("Invalid quantity!");
            return;
        }

        if (currentStock < quantity) {
            System.out.println("Not enough stock!");
            return;
        }

        int newStock = currentStock - quantity;

        collection.updateOne(
                new Document("medicineId", id),
                new Document("$set", new Document("stock", newStock)));

        System.out.println("Medicine sold successfully! Remaining stock: " + newStock);
    }
}