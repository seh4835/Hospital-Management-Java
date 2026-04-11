package model;

public class TestRecord {

    private int testId;
    private String patientName;
    private String testType;
    private String result;
    private String date;
    private String time; // ✅ NEW FIELD

    public TestRecord(int testId, String patientName, String testType,
            String result, String testDate, String time) {

        this.testId = testId;
        this.patientName = patientName;
        this.testType = testType;
        this.result = result;
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

    public String getResult() {
        return result;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }
}