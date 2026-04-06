package main;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class TestConnection {
    public static void main(String[] args) {
        try {
            MongoClient client = MongoClients.create("mongodb://localhost:27017");
            MongoDatabase database = client.getDatabase("hospital_db");

            System.out.println("Connected to MongoDB successfully!");
        } catch (Exception e) {
            System.out.println("Connection Failed: " + e.getMessage());
        }
    }
}