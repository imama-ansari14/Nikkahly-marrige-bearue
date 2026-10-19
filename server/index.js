import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket, ObjectId } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));

let bucket;

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", ""], default: "" },
    age: Number,
    cast: String,
    height: String,
    weight: String,
    complextion: String,
    education: String,
    passingYear: Number,
    maritalStatus: String,
    motherTongue: String,
    jobTitle: String,
    designation: String,
    earningSalary: String,
    fatherOccupation: String,
    mother: String,
    brothers: String,
    sisters: String,
    familyStatus: String,
    country: String,
    city: String,
    houseOwnRent: String,
    fullAddress: String,
    reqMaritalStatus: String,
    reqAgeLimit: String,
    reqCast: String,
    reqHeight: String,
    reqCity: String,
    reqArea: String,
    reqDemand: String,
  },
  { timestamps: true },
);

const Client = mongoose.model("Client", clientSchema);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Login required." });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  )
    return res.status(401).json({ message: "Incorrect email or password." });
  const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.json({ token });
});

function publicClient(c, imageCount = 0) {
  const x = c.toObject();
  return { ...x, imageCount };
}

app.get("/api/clients", auth, async (req, res) => {
  try {
    const { search = "", gender = "" } = req.query;
    const filter = {};
    if (gender) filter.gender = gender;
    if (search) {
      const rx = new RegExp(
        String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
      filter.$or = [
        { name: rx },
        { city: rx },
        { cast: rx },
        { jobTitle: rx },
        { maritalStatus: rx },
        { education: rx },
      ];
    }
    const clients = await Client.find(filter).sort({ createdAt: -1 }).lean();
    const db = bucket.s.db;
    const counts = await db
      .collection("clientImages.files")
      .aggregate([
        { $match: { "metadata.clientId": { $in: clients.map((c) => c._id) } } },
        { $group: { _id: "$metadata.clientId", count: { $sum: 1 } } },
      ])
      .toArray();
    const map = new Map(counts.map((x) => [String(x._id), x.count]));
    res.json(
      clients.map((c) => ({ ...c, imageCount: map.get(String(c._id)) || 0 })),
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/api/clients/:id", auth, async (req, res) => {
  try {
    const c = await Client.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Client not found." });
    res.json(publicClient(c));
  } catch (e) {
    res.status(400).json({ message: "Invalid client ID." });
  }
});

app.post("/api/clients", auth, async (req, res) => {
  try {
    const c = await Client.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.put("/api/clients/:id", auth, async (req, res) => {
  try {
    const c = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!c) return res.status(404).json({ message: "Client not found." });
    res.json(c);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.delete("/api/clients/:id", auth, async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    await bucket
      .find({ "metadata.clientId": id })
      .toArray()
      .then(async (files) => {
        for (const f of files) await bucket.delete(f._id);
      });
    const c = await Client.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ message: "Client not found." });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.get("/api/clients/:id/images", auth, async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const files = await bucket.find({ "metadata.clientId": id }).toArray();
    res.json(
      files.map((f) => ({
        _id: String(f._id),
        originalName: f.filename,
        mimeType: f.contentType,
        size: f.length,
        createdAt: f.uploadDate,
      })),
    );
  } catch (e) {
    res.status(400).json({ message: "Unable to load images." });
  }
});

app.post(
  "/api/clients/:id/images",
  auth,
  upload.array("images", 12),
  async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);
      if (!client)
        return res.status(404).json({ message: "Client not found." });
      if (!req.files?.length)
        return res.status(400).json({ message: "No images selected." });
      const results = [];
      for (const file of req.files) {
        const stream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
          metadata: { clientId: client._id },
        });
        await new Promise((resolve, reject) => {
          stream.on("finish", resolve);
          stream.on("error", reject);
          stream.end(file.buffer);
        });
        results.push(String(stream.id));
      }
      res.status(201).json({ ids: results });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
);

app.delete("/api/images/:id", auth, async (req, res) => {
  try {
    await bucket.delete(new ObjectId(req.params.id));
    res.json({ ok: true });
  } catch (e) {
    res.status(404).json({ message: "Image not found." });
  }
});

app.get("/api/images/:id", auth, async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const file = await bucket.find({ _id: id }).next();
    if (!file) return res.status(404).end();
    res.set("Content-Type", file.contentType || "application/octet-stream");
    res.set("Cache-Control", "private, max-age=3600");
    bucket.openDownloadStream(id).pipe(res);
  } catch {
    res.status(404).end();
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "clientImages",
    });
    app.listen(PORT, () =>
      console.log(`Nikkahly API running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
