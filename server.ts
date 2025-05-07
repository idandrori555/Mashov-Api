import express from "express";
import bodyParser from "body-parser";
import { Client } from "./api.ts"; // your provided class
import {
  AbsenceSummary,
  GradeRecord,
  StudentEvent,
  LessonType,
} from "./types.ts";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const clients = new Map<string, Client>(); // Store clients by a session ID or something similar

// Create a new session and log in
app.post("/login", async (req, res) => {
  const { semel, year, username, password } = req.body;

  if (!semel || !year || !username || !password) {
    res.status(400).json({ error: "Missing credentials" });
    return;
  }

  const client = new Client(semel, year, username, password);

  try {
    await client.login();
    const sessionId = `${username}-${Date.now()}`;
    clients.set(sessionId, client);
    res.json({ sessionId });
  } catch (err) {
    res.status(401).json({ error: "Login failed", details: err });
  }
});

// Get grades for a session
app.get("/grades/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const client = clients.get(sessionId);

  if (!client) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  try {
    const grades: GradeRecord[] = await client.getGrades();
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch grades", details: err });
  }
});

// Get absence summary
app.get("/absences/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const client = clients.get(sessionId);

  if (!client) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  try {
    const absences: AbsenceSummary[] = await client.getAbsenceSummary();
    res.json(absences);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch absences", details: err });
  }
});

// Get behaviour log
app.get("/behaviour/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const client = clients.get(sessionId);

  if (!client) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  try {
    const events: StudentEvent[] = await client.getBehaviour();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch behaviour", details: err });
  }
});

// Get lesson history for a group
app.get("/lessons/:sessionId/:groupId", async (req, res) => {
  const { sessionId, groupId } = req.params;
  const client = clients.get(sessionId);

  if (!client) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  try {
    const lessons: LessonType[] = await client.getLessons(groupId);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lessons", details: err });
  }
});

// Handle static file serving
app.get("/", (_req, res) => {
  res.status(200).sendFile("index.html");
});

app.listen(port, () => {
  console.log(`Mashov mock server running on http://localhost:${port}`);
});
