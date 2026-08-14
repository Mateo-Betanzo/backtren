export function isProfesor(req, res, next) {
  // Este middleware asume que verificarToken ya corrió antes y seteó req.usuario
  if (!req.usuario) {
    return res.status(401).json({ mensaje: "No autenticado" });
  }

  if (req.usuario.rol !== "profesor") {
    return res.status(403).json({ mensaje: "Acceso denegado: se requiere rol profesor" });
  }

  next();
}