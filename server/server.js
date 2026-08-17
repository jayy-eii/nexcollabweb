require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
app.use(cors());

app.use(express.json());
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Sirf image files allowed hain"));
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => console.log("MongoDB connection error ❌", err));

app.get("/", (req, res) => {
    res.send("Hello World! Backend chal raha hai 🎉");
});

// ===== SIGNUP API =====
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Ye email already registered hai" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({ message: "Account ban gaya! 🎉" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Kuch galat ho gaya, dobara try karo" });
    }
});

// ===== LOGIN API =====
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email ya password galat hai" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email ya password galat hai" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful! 🎉",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Kuch galat ho gaya, dobara try karo" });
    }
});

// ===== AUTH MIDDLEWARE (protects profile routes) =====
function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Login required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Session expired, dobara login karo" });
    }

}
// ===== UPLOAD IMAGES (avatar or portfolio) =====
app.post("/api/upload", verifyToken, upload.array("files", 6), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Koi file nahi mili" });
        }
        const urls = req.files.map(
            (f) => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
        );
        res.status(200).json({ urls });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Upload fail ho gaya" });
    }
});

// ===== GET MY PROFILE =====
app.get("/api/profile/me", verifyToken, async (req, res) => {
    try {

        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User nahi mila" });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Kuch galat ho gaya, dobara try karo" });
    }
});

// ===== UPDATE MY PROFILE =====
app.put("/api/profile", verifyToken, async (req, res) => {
    try {

        const { bio, category, avatar, followers, socialLinks, portfolio } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { bio, category, avatar, followers, socialLinks, portfolio },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile update ho gaya! 🎉",
            user: updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Kuch galat ho gaya, dobara try karo" });
    }
});

// ===== GET ANY USER'S PUBLIC PROFILE (by id) =====
app.get("/api/profile/:id", async (req, res) => {
    try {

        const user = await User.findById(req.params.id).select("-password -email");

        if (!user) {
            return res.status(404).json({ message: "User nahi mila" });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Kuch galat ho gaya, dobara try karo" });
    }
});

// ===== GET ALL CREATORS (for Find Creators page — public) =====
app.get("/api/creators", async (req, res) => {
    try {

        // only show creators who have actually filled in a profile
        const creators = await User.find({
            role: "creator",
            bio: { $ne: "" }
        }).select("name bio category avatar followers socialLinks createdAt");

        res.status(200).json({ creators });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Kuch galat ho gaya, dobara try karo" });
    }
});

app.listen(PORT, () => {
    console.log(`Server chal raha hai: http://localhost:${PORT}`);
});