import {
  getMateriasService,
  getMateriasDisponiblesService,
  inscribirAlumnoService,
  desinscribirAlumnoService,
  createMateriaService,
  updateMateriaService,
  deleteMateriaService,
} from "../services/materias.service.js";

export const getMaterias = async (req, res) => {
  try {
    const materias = await getMateriasService(req.usuario);

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

export const getMateriasDisponibles = async (req, res) => {
  try {
    const materias = await getMateriasDisponiblesService(req.usuario.id);

    return res.status(200).json({
      message: "Materias disponibles retrieved successfully",
      data: materias,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const inscribirMateria = async (req, res) => {
  try {
    const { materiaId } = req.body;

    if (!materiaId) {
      return res.status(400).json({ message: "El ID de la materia es obligatorio" });
    }

    const alumnoId = req.usuario.id;
    const resultado = await inscribirAlumnoService(alumnoId, materiaId);

    return res.status(200).json({
      message: resultado.message,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const desinscribirMateria = async (req, res) => {
  try {
    const { materiaId } = req.body;
    const id = materiaId || req.params.id;

    if (!id) {
      return res.status(400).json({ message: "El ID de la materia es obligatorio" });
    }

    const alumnoId = req.usuario.id;
    const resultado = await desinscribirAlumnoService(alumnoId, id);

    return res.status(200).json({
      message: resultado.message,
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

export const updateMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const profesorId = req.usuario.id;

    const materia = await updateMateriaService({ materiaId: id, nombre, profesorId });

    return res.status(200).json({
      message: "Materia updated successfully",
      data: materia,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const profesorId = req.usuario.id;

    const materia = await deleteMateriaService({ materiaId: id, profesorId });

    return res.status(200).json({
      message: "Materia deleted successfully",
      data: materia,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
