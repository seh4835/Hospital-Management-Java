package model;

public class MedicalRecord {

    private int recordId;
    private String patientName;
    private String doctorName;
    private String diagnosis;
    private String treatment;
    private String date;

    public MedicalRecord(int recordId, String patientName, String doctorName,
            String diagnosis, String treatment, String date) {

        this.recordId = recordId;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.date = date;
    }

    public int getRecordId() {
        return recordId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public String getTreatment() {
        return treatment;
    }

    public String getDate() {
        return date;
    }
}