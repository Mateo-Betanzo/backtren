import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  getPerfil,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import { verificarToken } from "../security/authMiddleware.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/perfil", verificarToken, getPerfil); // ← GET protegida
router.get("/:id", getUser);

router.post("/", createUser); // protegida de nuevo

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;