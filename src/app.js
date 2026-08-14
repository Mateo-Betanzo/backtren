import express from "express";
import cors from "cors";
import morgan from "morgan";

import healthRoutes from "./router/health.route.js";
import userRoute from "./router/users.route.js";
import authRoute from "./router/authRoutes.js";
import materiasRoute from "./router/materias.route.js";
import { generalLimiter } from "./security/rateLimiter.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(generalLimiter); // aplica a todas las rutas

app.use("/health", healthRoutes);
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/materias", materiasRoute);

export default app;