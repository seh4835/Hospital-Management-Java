package scratch;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class ResetDatabase {
    public static void main(String[] args) {
        try (MongoClient client = MongoClients.create("mongodb://localhost:27017")) {
            MongoDatabase database = client.getDatabase("hospital_db");
            System.out.println("Dropping all collections in hospital_db...");
            for (String name : database.listCollectionNames()) {
                database.getCollection(name).drop();
                System.out.println("Dropped: " + name);
            }
            System.out.println("Database reset complete.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
