import app from "../src/app";
import request from "supertest";

describe("API Endpoints", () => {
  it("should register a teacher with students", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        teacher: "teacher1@example.com",
        students: ["student1@example.com", "student2@example.com"]
      });
    
    expect(res.status).toBe(204);
  });

  it("should retrieve students for a teacher", async () => {
    const res = await request(app)
      .get("/api/commonstudents?teacher=teacher1@example.com");

    expect(res.status).toBe(200);
    expect(res.body.students).toEqual(
      expect.arrayContaining(["student1@example.com", "student2@example.com"])
    );
  });

  it("should suspend a student", async () => {
    const res = await request(app)
      .post("/api/suspend")
      .send({ student: "student3@example.com" });

    expect(res.status).toBe(204);
  });

  it("should send a notification to students (excluding suspended ones)", async () => {
    const res = await request(app)
      .post("/api/retrievefornotifications")
      .send({
        teacher: "teacher1@example.com",
        notification: "Hello @student1@example.com @student3@example.com"
      });

    expect(res.status).toBe(200);
    expect(res.body.recipients).toEqual(
      expect.arrayContaining(["student1@example.com"])
    );
    expect(res.body.recipients).not.toContain("student3@example.com"); // Suspended student
  });
});
