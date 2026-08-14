import {
  getMateriasService,
  createMateriaService,
} from "../services/materias.service.js";

export const getMaterias = async (req, res) => {
  try {
    const materias = await getMateriasService();

    return res.status(200).json({
      message: "Materias retrieved successfully",
      data: materias,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const createMateria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    // profesor_id sale del token, no del body
    const profesorId = req.usuario.id;

    const materia = await createMateriaService({ nombre, profesorId });

    return res.status(201).json({
      message: "Materia created successfully",
      data: materia,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};