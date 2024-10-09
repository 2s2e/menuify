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
const Menus = require("./models/Menus");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post("/api/post", (req, res) => {
  const { group, restaurant, category, subcategory, item, image, id } =
    req.body;
  Menus.create({ group, restaurant, category, subcategory, item, image, id })
    .then((result) => {
      console.log(result);
      res.status(200).json({ success: true, message: "Posted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ sucess: false, message: "Failed to post" });
    });
});

app.put("/api/addImage/:id", (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  Menus.findOneAndUpdate({ id: id }, { $push: { reviews: review } })
    .then((result) => {
      console.log(result);
      res.status(200).json({ success: true, message: "Image added" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ success: false, message: "Failed to add image" });
    });
});

app.get("/api/getItem/:name", (req, res) => {
  const { name } = req.params;
  console.log(name);
  Menus.findOne({ item: name })
    .then((result) => {
      console.log(result);
      res.status(200).json({ success: true, item: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ sucess: false, message: "Failed to fetch item" });
    });
});

app.get("/api/getItem/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  Menus.findOne({ id: id })
    .then((result) => {
      console.log(result);
      res.status(200).json({ success: true, item: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ sucess: false, message: "Failed to fetch item" });
    });
});

app.get("/api/getAllItems", (req, res) => {
  Menus.find()
    .then((result) => {
      // console.log(result.length)
      res.status(200).json({success:true, items: result})
    }
  ).catch( err => {
    res.status(400).json({success:false, message: 'Failed to get all items'})
  })
})

app.get("/api/getByGroup/:group", (req,res) => {
  const {group} = req.params;
  Menus.findAll({group})
  .then( result => {
      // console.log(result.length)
      res.status(200).json({success:true, items: result})
    }
  ).catch( err => {
    res.status(400).json({success:false, message: 'Failed to get all items'})
  })
})

const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URI).then(() => {
//     console.log("Connected to MongoDB database!")
// })

mongoose
  .connect("mongodb://127.0.0.1:27017/menus")
  .then(() => console.log("Connected to MongoDB database!"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
