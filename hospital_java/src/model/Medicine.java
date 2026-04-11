package model;

public class Medicine {

    private int medicineId;
    private String name;
    private int stock;
    private double price;

    public Medicine(int medicineId, String name, int stock, double price) {
        this.medicineId = medicineId;
        this.name = name;
        this.stock = stock;
        this.price = price;
    }

    public int getMedicineId() {
        return medicineId;
    }

    public String getName() {
        return name;
    }

    public int getStock() {
        return stock;
    }

    public double getPrice() {
        return price;
    }
}