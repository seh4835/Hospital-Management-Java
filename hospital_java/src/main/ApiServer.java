package main;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import dao.AppointmentDAO;
import dao.DoctorDAO;
import dao.PatientDAO;
import dao.BedDAO;
import dao.OTRoomDAO;
import dao.MedicalRecordDAO;
import dao.BillingDAO;
import dao.PharmacyDAO;
import dao.LabDAO;
import dao.OperationDAO;
import model.Appointment;
import model.Doctor;
import model.Patient;
import model.MedicalRecord;
import model.Bill;
import model.Medicine;
import model.TestRecord;
import model.Bed;
import model.OTRoom;
import model.Operation;
import org.bson.Document;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.util.List;
import java.nio.charset.StandardCharsets;

public class ApiServer {

    private static PatientDAO patientDAO = new PatientDAO();
    private static DoctorDAO doctorDAO = new DoctorDAO();
    private static AppointmentDAO appointmentDAO = new AppointmentDAO();
    private static BedDAO bedDAO = new BedDAO();
    private static OTRoomDAO otRoomDAO = new OTRoomDAO();
    private static MedicalRecordDAO recordDAO = new MedicalRecordDAO();
    private static BillingDAO billingDAO = new BillingDAO();
    private static PharmacyDAO pharmacyDAO = new PharmacyDAO();
    private static LabDAO labDAO = new LabDAO();
    private static OperationDAO operationDAO = new OperationDAO();

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/patients", new PatientHandler());
        server.createContext("/api/doctors", new DoctorHandler());
        server.createContext("/api/appointments", new AppointmentHandler());
        server.createContext("/api/rooms/beds", new BedRoomHandler());
        server.createContext("/api/rooms/ot", new OTRoomHandler());
        server.createContext("/api/rooms", new RoomHandler());
        server.createContext("/api/records", new RecordHandler());
        server.createContext("/api/billing", new BillingHandler());
        server.createContext("/api/pharmacy", new PharmacyHandler());
        server.createContext("/api/lab", new LabHandler());
        server.createContext("/api/operations", new OperationHandler());

        server.setExecutor(null);
        System.out.println("Starting API Server on port 8080...");
        server.start();
    }

    private static void setCORSAndHeaders(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");
        exchange.getResponseHeaders().add("Content-Type", "application/json");

        if ("OPTIONS".equals(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
        }
    }

    static class PatientHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            if ("GET".equals(method)) {
                List<Document> patients = patientDAO.getPatientsList();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < patients.size(); i++) {
                    Document doc = patients.get(i);
                    // Format ID to 001, 002, etc.
                    if (doc.get("patientId") != null) {
                        int id = Integer.parseInt(doc.get("patientId").toString());
                        doc.put("patientId", String.format("%03d", id));
                    }
                    json.append(doc.toJson());
                    if (i < patients.size() - 1)
                        json.append(",");
                }
                json.append("]");
                byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, response.length);
                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();
            } else if ("POST".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    // AUTO-GENERATE ID
                    int pid = patientDAO.getNextId();
                    String name = doc.getString("name");
                    int age = Integer.parseInt(doc.get("age").toString());
                    String disease = doc.getString("disease");

                    Patient p = new Patient(pid, name, age, disease);
                    patientDAO.addPatient(p);
                    String response = "{\"status\":\"success\", \"patientId\":\"" + String.format("%03d", pid) + "\"}";
                    exchange.sendResponseHeaders(201, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("PUT".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    int pid = Integer.parseInt(doc.get("patientId").toString());
                    String disease = doc.getString("disease");
                    patientDAO.updatePatient(pid, disease);
                    String response = "{\"status\":\"success\"}";
                    exchange.sendResponseHeaders(200, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("DELETE".equals(method)) {
                String query = exchange.getRequestURI().getQuery(); // e.g. "id=1"
                try {
                    if (query != null && query.contains("id=")) {
                        int id = Integer.parseInt(query.split("id=")[1]);
                        patientDAO.deletePatient(id);
                        String response = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
                } catch (Exception e) {
                    String response = "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        }
    }

    static class DoctorHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            if ("GET".equals(method)) {
                String query = exchange.getRequestURI().getQuery();
                List<Document> doctors;
                if (query != null && query.contains("name=")) {
                    String searchName = query.split("name=")[1];
                    doctors = doctorDAO.getDoctorsByName(searchName);
                } else {
                    doctors = doctorDAO.getDoctorsList();
                }
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < doctors.size(); i++) {
                    Document doc = doctors.get(i);
                    if (doc.get("doctorId") != null) {
                        int id = Integer.parseInt(doc.get("doctorId").toString());
                        doc.put("doctorId", String.format("%03d", id));
                    }
                    json.append(doc.toJson());
                    if (i < doctors.size() - 1)
                        json.append(",");
                }
                json.append("]");
                byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, response.length);
                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();
            } else if ("POST".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    // AUTO-GENERATE ID
                    int did = doctorDAO.getNextId();
                    String name = doc.getString("name");
                    int age = Integer.parseInt(doc.get("age").toString());
                    String spec = doc.getString("specialization");

                    Doctor d = new Doctor(did, name, age, spec);
                    doctorDAO.addDoctor(d);
                    String response = "{\"status\":\"success\", \"doctorId\":\"" + String.format("%03d", did) + "\"}";
                    exchange.sendResponseHeaders(201, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("DELETE".equals(method)) {
                String query = exchange.getRequestURI().getQuery();
                try {
                    if (query != null && query.contains("id=")) {
                        int id = Integer.parseInt(query.split("id=")[1]);
                        doctorDAO.deleteDoctor(id);
                        String response = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
                } catch (Exception e) {
                    String response = "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        }
    }

    static class RoomHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            try {
                if ("GET".equals(method)) {
                    List<Document> beds = bedDAO.getBedsList();
                    List<Document> ots = otRoomDAO.getOTRoomsList();
                    StringBuilder json = new StringBuilder("[");

                    for (int i = 0; i < beds.size(); i++) {
                        Document doc = beds.get(i);
                        int id = Integer.parseInt(doc.get("bedId").toString());
                        doc.put("roomId", String.format("%03d", id));
                        doc.put("roomType", "BED");
                        json.append(doc.toJson());
                        if (i < beds.size() - 1 || !ots.isEmpty())
                            json.append(",");
                    }
                    for (int i = 0; i < ots.size(); i++) {
                        Document doc = ots.get(i);
                        int id = Integer.parseInt(doc.get("roomId").toString());
                        doc.put("roomId", String.format("%03d", id));
                        doc.put("roomType", "OT");
                        json.append(doc.toJson());
                        if (i < ots.size() - 1)
                            json.append(",");
                    }

                    json.append("]");
                    byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(200, response.length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response);
                    os.close();
                } else if ("POST".equals(method)) {
                    InputStream is = exchange.getRequestBody();
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    Document doc = Document.parse(body);
                    String roomType = doc.getString("roomType");

                    if ("BED".equals(roomType)) {
                        int rid = bedDAO.getNextId();
                        bedDAO.addBed(new Bed(rid, false, ""));
                        String response = "{\"status\":\"success\", \"roomId\":\"" + String.format("%03d", rid) + "\"}";
                        exchange.sendResponseHeaders(201, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    } else if ("OT".equals(roomType)) {
                        int rid = otRoomDAO.getNextId();
                        otRoomDAO.addOTRoom(new OTRoom(rid, false, ""));
                        String response = "{\"status\":\"success\", \"roomId\":\"" + String.format("%03d", rid) + "\"}";
                        exchange.sendResponseHeaders(201, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    } else {
                        throw new Exception("roomType must be 'BED' or 'OT'!");
                    }
                } else if ("PUT".equals(method)) {
                    InputStream is = exchange.getRequestBody();
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    Document doc = Document.parse(body);
                    Object roomIdObj = doc.get("roomId");
                    if (roomIdObj == null)
                        throw new Exception("Room ID required!");
                    int id = Integer.parseInt(roomIdObj.toString());
                    String action = doc.getString("action");
                    String typeHint = doc.getString("roomType"); // OPTIONAL HINT

                    if ("assign".equals(action)) {
                        String patientName = doc.getString("patientName");
                        if ("OT".equals(typeHint)) {
                            otRoomDAO.assignRoom(id, patientName);
                        } else {
                            bedDAO.assignBed(id, patientName);
                        }
                    } else if ("free".equals(action)) {
                        if ("OT".equals(typeHint)) {
                            otRoomDAO.freeRoom(id);
                        } else {
                            bedDAO.freeBed(id);
                        }
                    } else if ("admit".equals(action)) {
                        String patientName = doc.getString("patientName");
                        if (patientName == null || patientName.isEmpty())
                            throw new Exception("Patient name required!");

                        boolean found = false;
                        for (Document p : patientDAO.getPatientsList()) {
                            if (p.getString("name").equals(patientName)) {
                                found = true;
                                break;
                            }
                        }
                        if (!found)
                            throw new Exception("Patient not found!");

                        int roomId = bedDAO.getAvailableBedId();
                        if (roomId == -1)
                            throw new Exception("No hospital beds available!");
                        bedDAO.assignBed(roomId, patientName);
                    } else if ("discharge".equals(action)) {
                        String patientName = doc.getString("patientName");
                        if (patientName == null || patientName.isEmpty())
                            throw new Exception("Patient name required!");
                        int roomId = bedDAO.getBedByPatient(patientName);
                        if (roomId == -1)
                            throw new Exception("Patient is not admitted!");
                        bedDAO.freeBed(roomId);
                    }
                    String response = "{\"status\":\"success\"}";
                    exchange.sendResponseHeaders(200, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } catch (Exception e) {
                String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }

    // ==================== BED ROOM HANDLER ====================
    static class BedRoomHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            try {
                if ("GET".equals(method)) {
                    List<Document> beds = bedDAO.getBedsList();
                    StringBuilder json = new StringBuilder("[");
                    for (int i = 0; i < beds.size(); i++) {
                        Document doc = beds.get(i);
                        int id = Integer.parseInt(doc.get("bedId").toString());
                        doc.put("roomId", String.format("%03d", id));
                        json.append(doc.toJson());
                        if (i < beds.size() - 1)
                            json.append(",");
                    }
                    json.append("]");
                    byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(200, response.length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response);
                    os.close();
                } else {
                    String response = "{\"status\":\"error\", \"message\":\"Use /api/rooms for mutations\"}";
                    exchange.sendResponseHeaders(405, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } catch (Exception e) {
                String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }

    // ==================== OT ROOM HANDLER ====================
    static class OTRoomHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            try {
                if ("GET".equals(method)) {
                    List<Document> otRooms = otRoomDAO.getOTRoomsList();
                    StringBuilder json = new StringBuilder("[");
                    for (int i = 0; i < otRooms.size(); i++) {
                        Document doc = otRooms.get(i);
                        int id = Integer.parseInt(doc.get("roomId").toString());
                        doc.put("roomId", String.format("%03d", id));
                        json.append(doc.toJson());
                        if (i < otRooms.size() - 1)
                            json.append(",");
                    }
                    json.append("]");
                    byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(200, response.length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response);
                    os.close();
                } else {
                    String response = "{\"status\":\"error\", \"message\":\"Use /api/rooms for mutations\"}";
                    exchange.sendResponseHeaders(405, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } catch (Exception e) {
                String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }

    static class AppointmentHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            if ("GET".equals(method)) {
                List<Document> appointments = appointmentDAO.getAppointmentsList();
                List<Document> patients = patientDAO.getPatientsList();
                List<Document> doctors = doctorDAO.getDoctorsList();

                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < appointments.size(); i++) {
                    Document appt = appointments.get(i);

                    // Format ID
                    if (appt.get("appointmentId") != null) {
                        int id = Integer.parseInt(appt.get("appointmentId").toString());
                        appt.put("appointmentId", String.format("%03d", id));
                    }
                    // Fallback for old records with IDs instead of Names
                    if (!appt.containsKey("patientName") && appt.containsKey("patientId")) {
                        int pid = appt.getInteger("patientId");
                        for (Document p : patients) {
                            if (p.getInteger("patientId") != null && p.getInteger("patientId") == pid) {
                                appt.put("patientName", p.getString("name"));
                                break;
                            }
                        }
                    }
                    if (!appt.containsKey("doctorName") && appt.containsKey("doctorId")) {
                        int did = appt.getInteger("doctorId");
                        for (Document d : doctors) {
                            if (d.getInteger("doctorId") != null && d.getInteger("doctorId") == did) {
                                appt.put("doctorName", d.getString("name"));
                                break;
                            }
                        }
                    }

                    json.append(appt.toJson());
                    if (i < appointments.size() - 1)
                        json.append(",");
                }
                json.append("]");
                byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, response.length);
                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();
            } else if ("POST".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    // AUTO-GENERATE ID
                    int aid = appointmentDAO.getNextId();
                    int pid = Integer.parseInt(doc.get("patientId").toString());
                    int did = Integer.parseInt(doc.get("doctorId").toString());
                    String date = doc.getString("date");

                    if (!patientDAO.exists(pid)) {
                        throw new Exception("Patient does not exist!");
                    }
                    if (!doctorDAO.exists(did)) {
                        throw new Exception("Doctor does not exist!");
                    }

                    Appointment a = new Appointment(aid, pid, did, date);
                    appointmentDAO.addAppointment(a);
                    String response = "{\"status\":\"success\", \"appointmentId\":\"" + String.format("%03d", aid)
                            + "\"}";
                    exchange.sendResponseHeaders(201, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("DELETE".equals(method)) {
                String query = exchange.getRequestURI().getQuery();
                try {
                    if (query != null && query.contains("id=")) {
                        int id = Integer.parseInt(query.split("id=")[1]);
                        appointmentDAO.deleteAppointment(id);
                        String response = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
                } catch (Exception e) {
                    String response = "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        }
    }

    static class RecordHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            if ("GET".equals(method)) {
                List<Document> records = recordDAO.getRecordsList();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < records.size(); i++) {
                    Document doc = records.get(i);
                    if (doc.get("recordId") != null) {
                        int id = Integer.parseInt(doc.get("recordId").toString());
                        doc.put("recordId", String.format("%03d", id));
                    }
                    json.append(doc.toJson());
                    if (i < records.size() - 1)
                        json.append(",");
                }
                json.append("]");
                byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, response.length);
                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();
            } else if ("POST".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    // AUTO-GENERATE ID
                    int rid = recordDAO.getNextId();
                    String pName = doc.getString("patientName");
                    String dName = doc.getString("doctorName");
                    String diag = doc.getString("diagnosis");
                    String treat = doc.getString("treatment");
                    String date = doc.getString("date");

                    MedicalRecord r = new MedicalRecord(rid, pName, dName, diag, treat, date);
                    recordDAO.addRecord(r);

                    String response = "{\"status\":\"success\", \"recordId\":\"" + String.format("%03d", rid) + "\"}";
                    exchange.sendResponseHeaders(201, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("PUT".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    int rid = Integer.parseInt(doc.get("recordId").toString());
                    String diag = doc.getString("diagnosis");
                    String treat = doc.getString("treatment");

                    if (!recordDAO.exists(rid))
                        throw new Exception("Record not found!");

                    recordDAO.updateRecord(rid, diag, treat);
                    String response = "{\"status\":\"success\"}";
                    exchange.sendResponseHeaders(200, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("DELETE".equals(method)) {
                String query = exchange.getRequestURI().getQuery();
                try {
                    if (query != null && query.contains("id=")) {
                        int id = Integer.parseInt(query.split("id=")[1]);
                        recordDAO.deleteRecord(id);
                        String response = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
                } catch (Exception e) {
                    String response = "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        }
    }

    // ==================== BILLING HANDLER ====================
    static class BillingHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            if ("GET".equals(method)) {
                List<Document> bills = billingDAO.getBillsList();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < bills.size(); i++) {
                    Document doc = bills.get(i);
                    if (doc.get("billId") != null) {
                        int id = Integer.parseInt(doc.get("billId").toString());
                        doc.put("billId", String.format("%03d", id));
                    }
                    json.append(doc.toJson());
                    if (i < bills.size() - 1)
                        json.append(",");
                }
                json.append("]");
                byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, response.length);
                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();
            } else if ("POST".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    // AUTO-GENERATE ID
                    int bid = billingDAO.getNextId();
                    String pName = doc.getString("patientName");
                    String treatment = doc.getString("treatment");
                    double amount = Double.parseDouble(doc.get("amount").toString());
                    String insurance = doc.getString("insuranceStatus");

                    Bill b = new Bill(bid, pName, treatment, amount, insurance);
                    billingDAO.addBill(b);
                    String response = "{\"status\":\"success\", \"billId\":\"" + String.format("%03d", bid) + "\"}";
                    exchange.sendResponseHeaders(201, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("DELETE".equals(method)) {
                String query = exchange.getRequestURI().getQuery();
                try {
                    if (query != null && query.contains("id=")) {
                        int id = Integer.parseInt(query.split("id=")[1]);
                        billingDAO.deleteBill(id);
                        String response = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
                } catch (Exception e) {
                    String response = "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        }
    }

    // ==================== PHARMACY (MEDICINES) HANDLER ====================
    static class PharmacyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            if ("GET".equals(method)) {
                List<Document> medicines = pharmacyDAO.getMedicinesList();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < medicines.size(); i++) {
                    Document doc = medicines.get(i);
                    if (doc.get("medicineId") != null) {
                        int id = Integer.parseInt(doc.get("medicineId").toString());
                        doc.put("medicineId", String.format("%03d", id));
                    }
                    json.append(doc.toJson());
                    if (i < medicines.size() - 1)
                        json.append(",");
                }
                json.append("]");
                byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, response.length);
                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();
            } else if ("POST".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    // AUTO-GENERATE ID
                    int mid = pharmacyDAO.getNextId();
                    String name = doc.getString("name");
                    int stock = Integer.parseInt(doc.get("stock").toString());
                    double price = Double.parseDouble(doc.get("price").toString());

                    Medicine m = new Medicine(mid, name, stock, price);
                    pharmacyDAO.addMedicine(m);
                    String response = "{\"status\":\"success\", \"medicineId\":\"" + String.format("%03d", mid) + "\"}";
                    exchange.sendResponseHeaders(201, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("PUT".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    int mid = Integer.parseInt(doc.get("medicineId").toString());
                    int stock = Integer.parseInt(doc.get("stock").toString());
                    double price = Double.parseDouble(doc.get("price").toString());

                    pharmacyDAO.updateMedicine(mid, stock, price);
                    String response = "{\"status\":\"success\"}";
                    exchange.sendResponseHeaders(200, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("DELETE".equals(method)) {
                String query = exchange.getRequestURI().getQuery();
                try {
                    if (query != null && query.contains("id=")) {
                        int id = Integer.parseInt(query.split("id=")[1]);
                        pharmacyDAO.deleteMedicine(id);
                        String response = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
                } catch (Exception e) {
                    String response = "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        }
    }

    // ==================== LAB (TESTS) HANDLER ====================
    static class LabHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            if ("GET".equals(method)) {
                List<Document> tests = labDAO.getTestsList();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < tests.size(); i++) {
                    Document doc = tests.get(i);
                    if (doc.get("testId") != null) {
                        int id = Integer.parseInt(doc.get("testId").toString());
                        doc.put("testId", String.format("%03d", id));
                    }
                    json.append(doc.toJson());
                    if (i < tests.size() - 1)
                        json.append(",");
                }
                json.append("]");
                byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, response.length);
                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();
            } else if ("POST".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    // AUTO-GENERATE ID
                    int tid = labDAO.getNextId();
                    String pName = doc.getString("patientName");
                    String testType = doc.getString("testType");
                    String status = doc.getString("status");
                    String date = doc.getString("date");
                    String time = doc.getString("time");

                    TestRecord t = new TestRecord(tid, pName, testType, status, date, time);
                    labDAO.addTest(t);
                    String response = "{\"status\":\"success\", \"testId\":\"" + String.format("%03d", tid) + "\"}";
                    exchange.sendResponseHeaders(201, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("PUT".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    int tid = Integer.parseInt(doc.get("testId").toString());
                    String status = doc.getString("status");

                    labDAO.updateTest(tid, status);
                    String response = "{\"status\":\"success\"}";
                    exchange.sendResponseHeaders(200, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("DELETE".equals(method)) {
                String query = exchange.getRequestURI().getQuery();
                try {
                    if (query != null && query.contains("id=")) {
                        int id = Integer.parseInt(query.split("id=")[1]);
                        labDAO.deleteTest(id);
                        String response = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
                } catch (Exception e) {
                    String response = "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        }
    }

    // ==================== OPERATIONS HANDLER ====================
    static class OperationHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSAndHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod()))
                return;
            String method = exchange.getRequestMethod();

            if ("GET".equals(method)) {
                List<Document> operations = operationDAO.getOperationsList();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < operations.size(); i++) {
                    Document doc = operations.get(i);
                    if (doc.get("operationId") != null) {
                        int id = Integer.parseInt(doc.get("operationId").toString());
                        doc.put("operationId", String.format("%03d", id));
                    }
                    if (doc.get("roomId") != null) {
                        int rid = Integer.parseInt(doc.get("roomId").toString());
                        doc.put("roomId", String.format("%03d", rid));
                    }
                    json.append(doc.toJson());
                    if (i < operations.size() - 1)
                        json.append(",");
                }
                json.append("]");
                byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, response.length);
                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();
            } else if ("POST".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    // AUTO-GENERATE ID
                    int oid = operationDAO.getNextId();
                    String pName = doc.getString("patientName");
                    String dName = doc.getString("doctorName");
                    int roomId = Integer.parseInt(doc.get("roomId").toString());
                    String date = doc.getString("date");
                    String time = doc.getString("time");

                    Operation op = new Operation(oid, pName, dName, roomId, date, time, "Scheduled");
                    operationDAO.addOperation(op, doctorDAO, otRoomDAO);
                    String response = "{\"status\":\"success\", \"operationId\":\"" + String.format("%03d", oid)
                            + "\"}";
                    exchange.sendResponseHeaders(201, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("PUT".equals(method)) {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                try {
                    Document doc = Document.parse(body);
                    int oid = Integer.parseInt(doc.get("operationId").toString());
                    String status = doc.getString("status");

                    operationDAO.updateStatus(oid, status, otRoomDAO);

                    String response = "{\"status\":\"success\"}";
                    exchange.sendResponseHeaders(200, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } catch (Exception e) {
                    String response = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            } else if ("DELETE".equals(method)) {
                String query = exchange.getRequestURI().getQuery();
                try {
                    if (query != null && query.contains("id=")) {
                        int id = Integer.parseInt(query.split("id=")[1]);
                        operationDAO.deleteOperation(id);
                        String response = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, response.getBytes().length);
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
                } catch (Exception e) {
                    String response = "{\"status\":\"error\"}";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        }
    }
}
