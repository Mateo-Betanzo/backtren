import { pool } from "../database.js";

export const getMateriasService = async () => {
  const result = await pool.query(`
    SELECT id, nombre, profesor_id, created_at
    FROM materias
    WHERE deleted_at IS NULL
    ORDER BY created_at
  `);

  return result.rows;
};

export const createMateriaService = async ({ nombre, profesorId }) => {
  const existing = await pool.query(
    `SELECT id FROM materias WHERE nombre = $1 AND deleted_at IS NULL`,
    [nombre]
  );

  if (existing.rows.length > 0) {
    throw new Error("La materia ya existe");
  }

  const result = await pool.query(
    `
    INSERT INTO materias (nombre, profesor_id)
    VALUES ($1, $2)
    RETURNING id, nombre, profesor_id, created_at
    `,
    [nombre, profesorId]
  );

  return result.rows[0];
};