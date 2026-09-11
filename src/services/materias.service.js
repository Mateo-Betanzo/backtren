import { pool } from "../database.js";

export const getMateriasService = async (usuario) => {
  if (usuario && usuario.rol === 'profesor') {
    const result = await pool.query(`
      SELECT 
        m.id, 
        m.nombre, 
        m.profesor_id, 
        m.created_at,
        COUNT(am.alumno_id)::int as students_count
      FROM materias m
      LEFT JOIN alumno_materia am ON m.id = am.materia_id
      WHERE m.profesor_id = $1 AND m.deleted_at IS NULL
      GROUP BY m.id, m.nombre, m.profesor_id, m.created_at
      ORDER BY m.created_at DESC
    `, [usuario.id]);
    return result.rows;
  }

  if (usuario && usuario.id) {
    // Alumno: Devuelve ÚNICAMENTE las materias en las que el alumno se inscribió previamente
    const result = await pool.query(`
      SELECT 
        m.id, 
        m.nombre, 
        m.profesor_id, 
        m.created_at,
        u.nombre as profesor_nombre
      FROM materias m
      JOIN alumno_materia am ON m.id = am.materia_id
      LEFT JOIN usuarios u ON m.profesor_id = u.id
      WHERE am.alumno_id = $1 AND m.deleted_at IS NULL
      ORDER BY m.created_at DESC
    `, [usuario.id]);
    return result.rows;
  }

  return [];
};

export const getMateriasDisponiblesService = async (alumnoId) => {
  const result = await pool.query(`
    SELECT 
      m.id, 
      m.nombre, 
      m.profesor_id, 
      m.created_at,
      u.nombre as profesor_nombre
    FROM materias m
    LEFT JOIN usuarios u ON m.profesor_id = u.id
    WHERE m.deleted_at IS NULL 
      AND m.id NOT IN (
        SELECT materia_id FROM alumno_materia WHERE alumno_id = $1
      )
    ORDER BY m.nombre ASC
  `, [alumnoId]);

  return result.rows;
};

export const inscribirAlumnoService = async (alumnoId, materiaId) => {
  const materiaCheck = await pool.query(
    `SELECT id FROM materias WHERE id = $1 AND deleted_at IS NULL`,
    [materiaId]
  );

  if (materiaCheck.rows.length === 0) {
    throw new Error("La materia no existe o fue eliminada");
  }

  await pool.query(
    `
    INSERT INTO alumno_materia (alumno_id, materia_id)
    VALUES ($1, $2)
    ON CONFLICT (alumno_id, materia_id) DO NOTHING
    `,
    [alumnoId, materiaId]
  );

  return { message: "Inscripción realizada con éxito" };
};

export const desinscribirAlumnoService = async (alumnoId, materiaId) => {
  const result = await pool.query(
    `
    DELETE FROM alumno_materia
    WHERE alumno_id = $1 AND materia_id = $2
    RETURNING alumno_id, materia_id
    `,
    [alumnoId, materiaId]
  );

  if (result.rows.length === 0) {
    throw new Error("No estabas inscripto en esta materia");
  }

  return { message: "Te has desinscripto correctamente de la materia" };
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

export const updateMateriaService = async ({ materiaId, nombre, profesorId }) => {
  const check = await pool.query(
    `SELECT id FROM materias WHERE id = $1 AND profesor_id = $2 AND deleted_at IS NULL`,
    [materiaId, profesorId]
  );

  if (check.rows.length === 0) {
    throw new Error("No tenés permiso para editar esta materia o no existe");
  }

  const result = await pool.query(
    `
    UPDATE materias
    SET nombre = $1
    WHERE id = $2 AND profesor_id = $3
    RETURNING id, nombre, profesor_id, created_at
    `,
    [nombre, materiaId, profesorId]
  );

  return result.rows[0];
};

export const deleteMateriaService = async ({ materiaId, profesorId }) => {
  const result = await pool.query(
    `
    UPDATE materias
    SET deleted_at = NOW()
    WHERE id = $1 AND profesor_id = $2 AND deleted_at IS NULL
    RETURNING id, nombre
    `,
    [materiaId, profesorId]
  );

  if (result.rows.length === 0) {
    throw new Error("No tenés permiso para eliminar esta materia o ya fue eliminada");
  }

  return result.rows[0];
};
