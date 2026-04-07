package main;

import dao.PatientDAO;
import java.util.Scanner;
import model.Patient;

public class TestConnection {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        PatientDAO dao = new PatientDAO();

        while (true) {
            System.out.println("\n--- Hospital Management System ---");
            System.out.println("1. Add Patient");
            System.out.println("2. View Patients");
            System.out.println("3. Update Patient");
            System.out.println("4. Delete Patient");
            System.out.println("5. Search Patient");
            System.out.println("6. Exit");

            System.out.print("Enter choice: ");
            int choice = sc.nextInt();

            switch (choice) {

                case 1:
                    System.out.print("Enter ID: ");
                    int id = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter Name: ");
                    String name = sc.nextLine();

                    System.out.print("Enter Age: ");
                    int age = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter Disease: ");
                    String disease = sc.nextLine();

                    Patient p = new Patient(id, name, age, disease);
                    dao.addPatient(p);
                    break;

                case 2:
                    dao.getAllPatients();
                    break;

                case 3:
                    System.out.print("Enter Patient ID: ");
                    int uid = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter new disease: ");
                    String newDisease = sc.nextLine();

                    dao.updatePatient(uid, newDisease);
                    break;

                case 4:
                    System.out.print("Enter Patient ID: ");
                    int did = sc.nextInt();

                    dao.deletePatient(did);
                    break;

                case 5:
                    System.out.print("Enter Patient ID: ");
                    int sid = sc.nextInt();

                    dao.searchPatient(sid);
                    break;

                case 6:
                    System.out.println("Exiting...");
                    return;

                default:
                    System.out.println("Invalid choice!");
            }
        }
    }
}