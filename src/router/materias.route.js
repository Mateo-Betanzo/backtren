import { Router } from "express";
import { getMaterias, createMateria } from "../controllers/materias.controller.js";
import { verificarToken } from "../security/authMiddleware.js";
import { isProfesor } from "../security/isProfesor.js";

const router = Router();

// Alumno y profesor pueden ver materias
router.get("/", verificarToken, getMaterias);

// Solo profesor puede crear materias
router.post("/", verificarToken, isProfesor, createMateria);

export default router;