import bcrypt from "bcrypt";
import { pool } from "../database.js";
import { generarToken } from "../security/token.js";

export async function login(email, password) {
  const result = await pool.query(
    `SELECT id, name, email, password_hash, rol FROM usuarios WHERE email = $1`,
    [email]
  );

  const usuario = result.rows[0];

  if (!usuario) {
    const error = new Error("Credenciales inválidas");
    error.status = 401;
    throw error;
  }

  const passwordValida = await bcrypt.compare(password, usuario.password_hash);

  if (!passwordValida) {
    const error = new Error("Credenciales inválidas");
    error.status = 401;
    throw error;
  }

  const token = generarToken(usuario);

  return {
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    },
  };
}