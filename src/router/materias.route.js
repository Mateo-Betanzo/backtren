import { Router } from "express";
import { 
  getMaterias, 
  getMateriasDisponibles, 
  inscribirMateria, 
  desinscribirMateria,
  createMateria,
  updateMateria,
  deleteMateria
} from "../controllers/materias.controller.js";
import { verificarToken } from "../security/authMiddleware.js";
import { isProfesor } from "../security/isProfesor.js";

const router = Router();

// Alumno y profesor pueden ver sus materias
router.get("/", verificarToken, getMaterias);

// Alumnos pueden ver materias disponibles para inscribirse
router.get("/disponibles", verificarToken, getMateriasDisponibles);

// Alumnos pueden inscribirse a materias
router.post("/inscribir", verificarToken, inscribirMateria);

// Alumnos pueden desinscribirse de una materia
router.post("/desinscribir", verificarToken, desinscribirMateria);
router.delete("/:id/desinscribir", verificarToken, desinscribirMateria);

// Solo profesor puede crear, editar y eliminar materias
router.post("/", verificarToken, isProfesor, createMateria);
router.put("/:id", verificarToken, isProfesor, updateMateria);
router.delete("/:id", verificarToken, isProfesor, deleteMateria);

export default router;
