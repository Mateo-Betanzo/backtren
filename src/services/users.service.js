import { pool } from "../database.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createUserService = async ({
  name,
  email,
  password,
  role,
}) => {
  // Verificar si el email ya existe
  const existingUser = await pool.query(
    `
    SELECT id
    FROM usuarios
    WHERE email = $1
    `,
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  // Hash de la contraseña
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Crear usuario
  const result = await pool.query(
    `
    INSERT INTO usuarios (
      name,
      email,
      password_hash,
      rol
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      name,
      email,
      rol
    `,
    [name, email, passwordHash, role]
  );

  return result.rows[0];
};

export const getAllUsersService = async () => {
  const result = await pool.query(`
    SELECT id, name, email, rol
    FROM usuarios
    ORDER BY id
  `);

  return result.rows;
};

export const getUserByIdService = async (id) => {
  const result = await pool.query(
    `
    SELECT id, name, email, rol
    FROM usuarios
    WHERE id = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

export const updateUserService = async (id, { name, email, password, role }) => {
  // Verificar que el usuario existe
  const existingUser = await pool.query(
    `SELECT id FROM usuarios WHERE id = $1`,
    [id]
  );

  if (existingUser.rows.length === 0) {
    throw new Error("User not found");
  }

  // Si se quiere cambiar el email, verificar que no lo use otro usuario
  if (email) {
    const emailInUse = await pool.query(
      `SELECT id FROM usuarios WHERE email = $1 AND id != $2`,
      [email, id]
    );

    if (emailInUse.rows.length > 0) {
      throw new Error("Email already registered");
    }
  }

  // Armar dinámicamente los campos a actualizar (solo los que vienen)
  const fields = [];
  const values = [];
  let index = 1;

  if (name) {
    fields.push(`name = $${index++}`);
    values.push(name);
  }

  if (email) {
    fields.push(`email = $${index++}`);
    values.push(email);
  }

  if (password) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    fields.push(`password_hash = $${index++}`);
    values.push(passwordHash);
  }

  if (role) {
    fields.push(`rol = $${index++}`);
    values.push(role);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  const result = await pool.query(
    `
    UPDATE usuarios
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, name, email, rol
    `,
    values
  );

  return result.rows[0];
};

export const deleteUserService = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM usuarios
    WHERE id = $1
    RETURNING id, name, email, rol
    `,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};