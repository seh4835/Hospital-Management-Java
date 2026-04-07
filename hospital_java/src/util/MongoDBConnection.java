package util;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class MongoDBConnection {

    private static final String URI = "mongodb://localhost:27017";
    private static final String DB_NAME = "hospital_db";

    private static MongoDatabase database = null;

    public static MongoDatabase getDatabase() {
        if (database == null) {
            MongoClient client = MongoClients.create(URI);
            database = client.getDatabase(DB_NAME);
        }
        return database;
    }
}