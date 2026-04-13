package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import model.Operation;
import org.bson.Document;
import util.MongoDBConnection;

public class OperationDAO {

    private MongoCollection<Document> collection;

    public OperationDAO() {
        MongoDatabase db = MongoDBConnection.getDatabase();
        collection = db.getCollection("operations");
    }

    // ---------------- CHECK EXISTENCE ----------------
    public boolean exists(int id) {
        return collection.find(new Document("operationId", id)).first() != null;
    }

    // ---------------- ADD OPERATION ----------------
    public void addOperation(Operation op, DoctorDAO doctorDAO, RoomDAO roomDAO) throws Exception {

        if (exists(op.getOperationId())) {
            throw new Exception("Operation with ID " + op.getOperationId() + " already exists!");
        }

        // Validate Doctor
        boolean doctorExists = false;
        for (org.bson.Document doc : doctorDAO.getDoctorsList()) {
            if (doc.getString("name").equals(op.getDoctorName())) {
                doctorExists = true;
                break;
            }
        }

        if (!doctorExists) {
            throw new Exception("Doctor '" + op.getDoctorName() + "' does not exist!");
        }

        // Validate Room
        if (!roomDAO.exists(op.getRoomId())) {
            throw new Exception("Operating Room ID " + op.getRoomId() + " does not exist!");
        }

        String roomType = roomDAO.getRoomType(op.getRoomId());
        if (!"OT".equals(roomType)) {
            throw new Exception("Room " + op.getRoomId() + " is not an OT Room! Please select an OT Room.");
        }

        if (roomDAO.isOccupied(op.getRoomId())) {
            throw new Exception("Operating Room " + op.getRoomId() + " is already occupied!");
        }

        // Insert Operation
        Document doc = new Document("operationId", op.getOperationId())
                .append("patientName", op.getPatientName())
                .append("doctorName", op.getDoctorName())
                .append("roomId", op.getRoomId())
                .append("date", op.getDate())
                .append("time", op.getTime())
                .append("status", op.getStatus());

        collection.insertOne(doc);

        // Mark room occupied
        roomDAO.assignRoom(op.getRoomId(), op.getPatientName());
    }

    // ---------------- UPDATE STATUS ----------------
    public void updateStatus(int id, String newStatus, RoomDAO roomDAO) throws Exception {

        Document op = collection.find(new Document("operationId", id)).first();
        if (op == null) {
            throw new Exception("Operation not found!");
        }

        collection.updateOne(
                new Document("operationId", id),
                new Document("$set", new Document("status", newStatus)));

        // Logical link: If completed, free the OT Room
        if ("Completed".equalsIgnoreCase(newStatus)) {
            int roomId = Integer.parseInt(op.get("roomId").toString());
            roomDAO.freeRoom(roomId);
        }
    }



    // ---------------- VIEW ALL OPERATIONS ----------------
    public void getAllOperations() {
        for (Document doc : collection.find()) {
            System.out.println(doc.toJson());
        }
    }

    // ---------------- GET OPERATIONS LIST ----------------
    public java.util.List<Document> getOperationsList() {
        return collection.find().into(new java.util.ArrayList<>());
    }

    // ---------------- SEARCH OPERATION ----------------
    public void searchOperation(int id) {

        Document doc = collection.find(
                new Document("operationId", id)
        ).first();

        if (doc != null) {
            System.out.println(doc.toJson());
        } else {
            System.out.println("Operation not found!");
        }
    }

    // ---------------- DELETE OPERATION ----------------
    public void deleteOperation(int id) {

        Document op = collection.find(
                new Document("operationId", id)
        ).first();

        if (op == null) {
            System.out.println("Operation not found!");
            return;
        }

        collection.deleteOne(new Document("operationId", id));

        System.out.println("Operation deleted successfully!");
    }
}