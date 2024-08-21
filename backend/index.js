const express = require("express");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const path = require("path");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

app.use(cors()); // Enable CORS for all routes

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer for file upload handling (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Utility function to generate a unique key for each file
const generateFileKey = (originalname) => {
  const ext = path.extname(originalname);
  const basename = crypto.randomBytes(16).toString("hex");
  return `${basename}${ext}`;
};

// Upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const fileKey = generateFileKey(req.file.originalname);

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    res.status(200).json({
      message: "Upload successful",
      fileKey: fileKey, // Return the key so it can be used to retrieve the file later
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Retrieve (Get) route
app.get("/image/:key", async (req, res) => {
  try {
    const getParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: req.params.key,
    };

    const command = new GetObjectCommand(getParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Signed URL valid for 1 hour

    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to generate signed URL");
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
