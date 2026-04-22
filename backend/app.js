import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bloodRoutes from "./routes/bloodRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import campRoutes from "./routes/campRoutes.js";
 import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "LifeLink API running" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blood", bloodRoutes);
app.use("/api/v1/ambulance", ambulanceRoutes);
app.use("/api/v1/hospitals", hospitalRoutes);
app.use("/api/v1/volunteers", volunteerRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notifications", notificationRoutes);
 app.use("/api/v1/camps", campRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
