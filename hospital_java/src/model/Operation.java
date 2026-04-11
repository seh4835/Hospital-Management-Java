package model;

public class Operation {

    private int operationId;
    private String patientName;
    private String doctorName;
    private int roomId;
    private String date;
    private String time;
    private String status;

    public Operation(int operationId, String patientName, String doctorName,
                     int roomId, String date, String time, String status) {

        this.operationId = operationId;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.roomId = roomId;
        this.date = date;
        this.time = time;
        this.status = status;
    }

    public int getOperationId() {
        return operationId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public int getRoomId() {
        return roomId;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getStatus() {
        return status;
    }
}

