package main;

import java.util.Scanner;

import dao.PatientDAO;
import dao.DoctorDAO;
import dao.AppointmentDAO;
import dao.RoomDAO;

import model.Patient;
import model.Doctor;
import model.Appointment;

public class TestConnection {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        PatientDAO patientDAO = new PatientDAO();
        DoctorDAO doctorDAO = new DoctorDAO();
        AppointmentDAO appointmentDAO = new AppointmentDAO();
        RoomDAO roomDAO = new RoomDAO();

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

            // ROOM / ADMISSION
            System.out.println("17. Admit Patient");
            System.out.println("18. Discharge Patient");

            // EXIT
            System.out.println("19. Exit");

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
                    String pnameSearch = sc.nextLine();
                    patientDAO.searchPatientByName(pnameSearch);
                    break;

                case 7:
                    sc.nextLine();
                    System.out.print("Enter Disease: ");
                    String disSearch = sc.nextLine();
                    patientDAO.searchPatientByDisease(disSearch);
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
                    String searchName = sc.nextLine();
                    doctorDAO.searchDoctorByName(searchName);
                    break;

                case 12:
                    sc.nextLine();
                    System.out.print("Enter Specialization: ");
                    String specSearch = sc.nextLine();
                    doctorDAO.searchDoctorBySpecialization(specSearch);
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
                        System.out.println("❌ Patient does not exist!");
                        break;
                    }

                    System.out.print("Enter Doctor ID: ");
                    int adid = sc.nextInt();

                    if (!doctorDAO.exists(adid)) {
                        System.out.println("❌ Doctor does not exist!");
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

                // ---------------- ADMIT PATIENT ----------------
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
                        System.out.println("❌ Patient not found!");
                        break;
                    }

                    int roomId = roomDAO.getAvailableRoom();

                    if (roomId == -1) {
                        System.out.println("❌ No rooms available!");
                        break;
                    }

                    roomDAO.assignRoom(roomId, patientName);

                    System.out.println("✅ Patient admitted to room: " + roomId);
                    break;

                // ---------------- DISCHARGE PATIENT ----------------
                case 18:

                    sc.nextLine();
                    System.out.print("Enter Patient Name: ");
                    String dname = sc.nextLine();

                    int dRoomId = roomDAO.getRoomByPatient(dname);

                    if (dRoomId == -1) {
                        System.out.println("❌ Patient is not admitted!");
                        break;
                    }

                    roomDAO.freeRoom(dRoomId);

                    System.out.println("✅ Patient discharged from room: " + dRoomId);
                    break;

                // ---------------- EXIT ----------------
                case 19:
                    System.out.println("Exiting...");
                    sc.close();
                    return;

                default:
                    System.out.println("Invalid choice!");
            }
        }
    }
}