const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const endorsementRoutes = require("./routes/endorsementRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ✅ STEP 1: CORS FIRST - before everything else
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ STEP 2: Handle preflight OPTIONS requests
app.options(/.*/, cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ STEP 3: Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ✅ STEP 4: Prevent HTTP param pollution
app.use(hpp());

// ✅ STEP 5: Prevent NoSQL injection

// ✅ STEP 6: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Too many requests from this IP. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many auth attempts. Please try again later.",
});

app.use(limiter);

// ✅ STEP 7: Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

const sanitizeObject = (value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  return Object.keys(value).reduce((safe, key) => {
    if (!key.startsWith("$") && !key.includes(".")) {
      safe[key] = sanitizeObject(value[key]);
    }

    return safe;
  }, {});
};

// Prevent common NoSQL injection operators without mutating Express 5 req.query.
app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  next();
});

// ✅ STEP 8: Logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ✅ STEP 9: Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ STEP 10: All API routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/endorsements", endorsementRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// ✅ STEP 11: Health check
app.get("/", (req, res) => {
  res.json({ message: "VeriFolio API Running", version: "1.0.0" });
});

// ✅ STEP 12: Error handlers last
app.use(notFound);
app.use(errorHandler);

module.exports = app;
