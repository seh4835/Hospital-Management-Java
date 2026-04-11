package main;

import java.util.Scanner;

import dao.*;
import model.*;

public class TestConnection {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        PatientDAO patientDAO = new PatientDAO();
        DoctorDAO doctorDAO = new DoctorDAO();
        AppointmentDAO appointmentDAO = new AppointmentDAO();
        RoomDAO roomDAO = new RoomDAO();
        MedicalRecordDAO recordDAO = new MedicalRecordDAO(); // ✅ NEW
        BillingDAO billingDAO = new BillingDAO(); // ✅ NEW
        PharmacyDAO pharmacyDAO = new PharmacyDAO(); // ✅ NEW
        LabDAO labDAO = new LabDAO(); // ✅ NEW
        OperationDAO operationDAO = new OperationDAO();

        while (true) {
            System.out.println("\n--- Hospital Management System ---");

            // PATIENT
            System.out.println("1. Add Patient");
            System.out.println("2. View Patients");
            System.out.println("3. Update Patient");
            System.out.println("4. Delete Patient");
            System.out.println("5. Search Patient by ID");
            System.out.println("6. Search Patient by Name");
            System.out.println("7. Search Patient by Disease");

            // DOCTOR
            System.out.println("8. Add Doctor");
            System.out.println("9. View Doctors");
            System.out.println("10. Delete Doctor");
            System.out.println("11. Search Doctor by Name");
            System.out.println("12. Search Doctor by Specialization");

            // APPOINTMENT
            System.out.println("13. Book Appointment");
            System.out.println("14. View Appointments");
            System.out.println("15. Delete Appointment");
            System.out.println("16. Search Appointment");

            // ROOM
            System.out.println("17. Admit Patient");
            System.out.println("18. Discharge Patient");

            // EMR / RECORDS
            System.out.println("19. Add Medical Record");
            System.out.println("20. View All Records");
            System.out.println("21. Search Record by ID");
            System.out.println("22. Search Records by Patient");
            System.out.println("23. Update Record");
            System.out.println("24. Delete Record");

            // BILLING
            System.out.println("25. Add Bill");
            System.out.println("26. View Bills");
            System.out.println("27. Search Bill by ID");
            System.out.println("28. Search Bills by Patient");
            System.out.println("29. Update Bill");
            System.out.println("30. Delete Bill");

            // PHARMACY 🔥
            System.out.println("31. Add Medicine");
            System.out.println("32. View Medicines");
            System.out.println("33. Search Medicine by ID");
            System.out.println("34. Search Medicine by Name");
            System.out.println("35. Update Medicine");
            System.out.println("36. Delete Medicine");
            System.out.println("37. Sell Medicine");

            // LAB 🔥
            System.out.println("38. Add Test Record");
            System.out.println("39. View All Tests");
            System.out.println("40. Search Test by ID");
            System.out.println("41. Search Tests by Patient");
            System.out.println("42. Update Test Result");
            System.out.println("43. Delete Test");

            System.out.println("44. Schedule Operation");
            System.out.println("45. View Operations");
            System.out.println("46. Search Operation");
            System.out.println("47. Delete Operation");

            // EXIT
            System.out.println("48. Exit");

            System.out.print("Enter choice: ");
            int choice = sc.nextInt();

            switch (choice) {

                // ---------------- PATIENT ----------------
                case 1:
                    int pid;
                    while (true) {
                        System.out.print("Enter Patient ID: ");
                        pid = sc.nextInt();
                        if (patientDAO.exists(pid)) {
                            System.out.println("ID already exists! Try again.");
                        } else
                            break;
                    }
                    sc.nextLine();

                    System.out.print("Enter Name: ");
                    String pname = sc.nextLine();

                    System.out.print("Enter Age: ");
                    int page = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter Disease: ");
                    String disease = sc.nextLine();

                    patientDAO.addPatient(new Patient(pid, pname, page, disease));
                    break;

                case 2:
                    patientDAO.getAllPatients();
                    break;

                case 3:
                    System.out.print("Enter Patient ID: ");
                    int upid = sc.nextInt();
                    sc.nextLine();
                    System.out.print("Enter new disease: ");
                    String newDisease = sc.nextLine();
                    patientDAO.updatePatient(upid, newDisease);
                    break;

                case 4:
                    System.out.print("Enter Patient ID: ");
                    patientDAO.deletePatient(sc.nextInt());
                    break;

                case 5:
                    System.out.print("Enter Patient ID: ");
                    patientDAO.searchPatient(sc.nextInt());
                    break;

                case 6:
                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    patientDAO.searchPatientByName(sc.nextLine());
                    break;

                case 7:
                    sc.nextLine();
                    System.out.print("Enter Disease: ");
                    patientDAO.searchPatientByDisease(sc.nextLine());
                    break;

                // ---------------- DOCTOR ----------------
                case 8:
                    int docId;
                    while (true) {
                        System.out.print("Enter Doctor ID: ");
                        docId = sc.nextInt();
                        if (doctorDAO.exists(docId)) {
                            System.out.println("ID already exists! Try again.");
                        } else
                            break;
                    }
                    sc.nextLine();

                    System.out.print("Enter Name: ");
                    String docName = sc.nextLine();

                    System.out.print("Enter Age: ");
                    int docAge = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter Specialization: ");
                    String spec = sc.nextLine();

                    doctorDAO.addDoctor(new Doctor(docId, docName, docAge, spec));
                    break;

                case 9:
                    doctorDAO.getAllDoctors();
                    break;

                case 10:
                    System.out.print("Enter Doctor ID: ");
                    doctorDAO.deleteDoctor(sc.nextInt());
                    break;

                case 11:
                    sc.nextLine();
                    System.out.print("Enter Doctor Name: ");
                    doctorDAO.searchDoctorByName(sc.nextLine());
                    break;

                case 12:
                    sc.nextLine();
                    System.out.print("Enter Specialization: ");
                    doctorDAO.searchDoctorBySpecialization(sc.nextLine());
                    break;

                // ---------------- APPOINTMENT ----------------
                case 13:
                    int aid;
                    while (true) {
                        System.out.print("Enter Appointment ID: ");
                        aid = sc.nextInt();
                        if (appointmentDAO.exists(aid)) {
                            System.out.println("ID already exists! Try again.");
                        } else
                            break;
                    }

                    System.out.print("Enter Patient ID: ");
                    int apid = sc.nextInt();
                    if (!patientDAO.exists(apid)) {
                        System.out.println("[ERROR] Patient does not exist!");
                        break;
                    }

                    System.out.print("Enter Doctor ID: ");
                    int adid = sc.nextInt();
                    if (!doctorDAO.exists(adid)) {
                        System.out.println("[ERROR] Doctor does not exist!");
                        break;
                    }

                    sc.nextLine();
                    System.out.print("Enter Date: ");
                    String date = sc.nextLine();

                    appointmentDAO.addAppointment(new Appointment(aid, apid, adid, date));
                    break;

                case 14:
                    appointmentDAO.getAllAppointments();
                    break;

                case 15:
                    System.out.print("Enter Appointment ID: ");
                    appointmentDAO.deleteAppointment(sc.nextInt());
                    break;

                case 16:
                    System.out.print("Enter Appointment ID: ");
                    appointmentDAO.searchAppointment(sc.nextInt());
                    break;

                // ---------------- ADMIT ----------------
                case 17:
                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    String patientName = sc.nextLine();

                    boolean found = false;
                    for (org.bson.Document doc : patientDAO.getPatientsList()) {
                        if (doc.getString("name").equals(patientName)) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        System.out.println("[ERROR] Patient not found!");
                        break;
                    }

                    int roomId = roomDAO.getAvailableRoom();
                    if (roomId == -1) {
                        System.out.println("[ERROR] No rooms available!");
                        break;
                    }

                    roomDAO.assignRoom(roomId, patientName);
                    System.out.println("[SUCCESS] Patient admitted to room: " + roomId);
                    break;

                // ---------------- DISCHARGE ----------------
                case 18:
                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    String dname = sc.nextLine();

                    int dRoomId = roomDAO.getRoomByPatient(dname);
                    if (dRoomId == -1) {
                        System.out.println("[ERROR] Patient is not admitted!");
                        break;
                    }

                    roomDAO.freeRoom(dRoomId);
                    System.out.println("[SUCCESS] Patient discharged from room: " + dRoomId);
                    break;

                // ---------------- EMR ----------------
                case 19:
                    int rid;
                    while (true) {
                        System.out.print("Enter Record ID: ");
                        rid = sc.nextInt();
                        if (recordDAO.exists(rid)) {
                            System.out.println("ID already exists! Try again.");
                        } else
                            break;
                    }

                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    String rPatient = sc.nextLine();

                    System.out.print("Enter Doctor Name: ");
                    String rDoctor = sc.nextLine();

                    System.out.print("Enter Diagnosis: ");
                    String diag = sc.nextLine();

                    System.out.print("Enter Treatment: ");
                    String treat = sc.nextLine();

                    System.out.print("Enter Date: ");
                    String rDate = sc.nextLine();

                    recordDAO.addRecord(new MedicalRecord(rid, rPatient, rDoctor, diag, treat, rDate));
                    break;

                case 20:
                    recordDAO.getAllRecords();
                    break;

                case 21:
                    System.out.print("Enter Record ID: ");
                    recordDAO.searchRecord(sc.nextInt());
                    break;

                case 22:
                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    recordDAO.searchByPatient(sc.nextLine());
                    break;

                case 23:
                    System.out.print("Enter Record ID: ");
                    int urid = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter new Diagnosis: ");
                    String ndiag = sc.nextLine();

                    System.out.print("Enter new Treatment: ");
                    String ntreat = sc.nextLine();

                    recordDAO.updateRecord(urid, ndiag, ntreat);
                    break;

                case 24:
                    System.out.print("Enter Record ID: ");
                    recordDAO.deleteRecord(sc.nextInt());
                    break;

                // ---------------- BILLING ----------------
                case 25:
                    int bid;
                    while (true) {
                        System.out.print("Enter Bill ID: ");
                        bid = sc.nextInt();
                        if (billingDAO.exists(bid)) {
                            System.out.println("ID already exists! Try again.");
                        } else
                            break;
                    }

                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    String bname = sc.nextLine();

                    System.out.print("Enter Treatment: ");
                    String treatment = sc.nextLine();

                    System.out.print("Enter Amount: ");
                    double amount = sc.nextDouble();
                    sc.nextLine();

                    System.out.print("Insurance (Yes/No): ");
                    String status = sc.nextLine();

                    billingDAO.addBill(new Bill(bid, bname, treatment, amount, status));
                    break;

                case 26:
                    billingDAO.getAllBills();
                    break;

                case 27:
                    System.out.print("Enter Bill ID: ");
                    billingDAO.searchBill(sc.nextInt());
                    break;

                case 28:
                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    billingDAO.searchByPatient(sc.nextLine());
                    break;

                case 29:
                    System.out.print("Enter Bill ID: ");
                    int ubid = sc.nextInt();

                    System.out.print("Enter New Amount: ");
                    double newAmount = sc.nextDouble();
                    sc.nextLine();

                    System.out.print("Enter New Insurance Status: ");
                    String newStatus = sc.nextLine();

                    billingDAO.updateBill(ubid, newAmount, newStatus);
                    break;

                case 30:
                    System.out.print("Enter Bill ID: ");
                    billingDAO.deleteBill(sc.nextInt());
                    break;

                // ---------------- PHARMACY ----------------

                case 31:
                    int mid;
                    while (true) {
                        System.out.print("Enter Medicine ID: ");
                        mid = sc.nextInt();
                        if (pharmacyDAO.exists(mid)) {
                            System.out.println("ID already exists! Try again.");
                        } else
                            break;
                    }

                    sc.nextLine();
                    System.out.print("Enter Medicine Name: ");
                    String mname = sc.nextLine();

                    System.out.print("Enter Stock: ");
                    int stock = sc.nextInt();

                    System.out.print("Enter Price: ");
                    double price = sc.nextDouble();

                    pharmacyDAO.addMedicine(new Medicine(mid, mname, stock, price));
                    break;

                case 32:
                    pharmacyDAO.getAllMedicines();
                    break;

                case 33:
                    System.out.print("Enter Medicine ID: ");
                    pharmacyDAO.searchMedicine(sc.nextInt());
                    break;

                case 34:
                    sc.nextLine();
                    System.out.print("Enter Medicine Name: ");
                    pharmacyDAO.searchByName(sc.nextLine());
                    break;

                case 35:
                    System.out.print("Enter Medicine ID: ");
                    int umid = sc.nextInt();

                    System.out.print("Enter New Stock: ");
                    int newStock = sc.nextInt();

                    System.out.print("Enter New Price: ");
                    double newPrice = sc.nextDouble();

                    pharmacyDAO.updateMedicine(umid, newStock, newPrice);
                    break;

                case 36:
                    System.out.print("Enter Medicine ID: ");
                    pharmacyDAO.deleteMedicine(sc.nextInt());
                    break;

                case 37:
                    System.out.print("Enter Medicine ID: ");
                    int sid = sc.nextInt();

                    System.out.print("Enter Quantity: ");
                    int qty = sc.nextInt();

                    pharmacyDAO.sellMedicine(sid, qty);
                    break;

                // ---------------- LAB ----------------
                case 38:
                    int tid;
                    while (true) {
                        System.out.print("Enter Test ID: ");
                        tid = sc.nextInt();
                        if (labDAO.exists(tid)) {
                            System.out.println("ID already exists! Try again.");
                        } else
                            break;
                    }

                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    String name = sc.nextLine();

                    System.out.print("Enter Test Type: ");
                    String type = sc.nextLine();

                    System.out.print("Enter Result: ");
                    String result = sc.nextLine();

                    System.out.print("Enter Date: ");
                    String testDate = sc.nextLine();

                    System.out.print("Enter Time: ");
                    String time = sc.nextLine();

                    labDAO.addTest(new TestRecord(tid, name, type, result, testDate, time));
                    break;

                case 39:
                    labDAO.getAllTests();
                    break;

                case 40:
                    System.out.print("Enter Test ID: ");
                    labDAO.searchTest(sc.nextInt());
                    break;

                case 41:
                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    labDAO.searchByPatient(sc.nextLine());
                    break;

                case 42:
                    System.out.print("Enter Test ID: ");
                    int utid = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter New Result: ");
                    String newResult = sc.nextLine();

                    labDAO.updateTest(utid, newResult);
                    break;

                case 43:
                    System.out.print("Enter Test ID: ");
                    labDAO.deleteTest(sc.nextInt());
                    break;

                // ---------------- OPERATION ----------------
                case 44:
                    int oid;
                    while (true) {
                        System.out.print("Enter Operation ID: ");
                        oid = sc.nextInt();

                        if (operationDAO.exists(oid)) {
                            System.out.println("ID already exists! Try again.");
                        } else
                            break;
                    }

                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    String opPatient = sc.nextLine();

                    System.out.print("Enter Doctor Name: ");
                    String opDoctor = sc.nextLine();

                    System.out.print("Enter Room ID: ");
                    int opRoom = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter Date: ");
                    String opDate = sc.nextLine();

                    System.out.print("Enter Time: ");
                    String opTime = sc.nextLine();

                    try {
                        operationDAO.addOperation(
                            new Operation(oid, opPatient, opDoctor, opRoom, opDate, opTime, "Scheduled"),
                            doctorDAO,
                            roomDAO
                        );
                        System.out.println("[SUCCESS] Operation scheduled successfully!");
                    } catch (Exception e) {
                        System.out.println("[ERROR] " + e.getMessage());
                    }
                    break;

                case 45:
                    operationDAO.getAllOperations();
                    break;

                case 46:
                    System.out.print("Enter Operation ID: ");
                    operationDAO.searchOperation(sc.nextInt());
                    break;

                case 47:
                    System.out.print("Enter Operation ID: ");
                    operationDAO.deleteOperation(sc.nextInt());
                    break;

                // ---------------- EXIT ----------------
                case 48:
                    System.out.println("Exiting...");
                    sc.close();
                    return;

                default:
                    System.out.println("Invalid choice!");
            }
        }
    }
}
