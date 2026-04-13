package model;

public class TestRecord {

    private int testId;
    private String patientName;
    private String testType;
    private String status;
    private String date;
    private String time; // ✅ NEW FIELD

    public TestRecord(int testId, String patientName, String testType,
            String status, String testDate, String time) {

        this.testId = testId;
        this.patientName = patientName;
        this.testType = testType;
        this.status = status;
        this.date = testDate;
        this.time = time;
    }

    public int getTestId() {
        return testId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getTestType() {
        return testType;
    }

    public String getStatus() {
        return status;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }
}