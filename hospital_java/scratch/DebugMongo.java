package scratch;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

public class DebugMongo {
    public static void main(String[] args) {
        try {
            MongoClient client = MongoClients.create("mongodb://localhost:27017");
            MongoDatabase database = client.getDatabase("hospital_db");
            MongoCollection<Document> collection = database.getCollection("rooms");
            
            System.out.println("Connecting to hospital_db.rooms...");
            for (Document doc : collection.find()) {
                System.out.println("Found room: " + doc.toJson());
                Object rid = doc.get("roomId");
                Object rtype = doc.get("roomType");
                if (rid != null) {
                    System.out.println("  roomId type: " + rid.getClass().getName() + " value: " + rid);
                }
                if (rtype != null) {
                    System.out.println("  roomType type: " + rtype.getClass().getName() + " value: '" + rtype + "'");
                }
            }
            client.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
