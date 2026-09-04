import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || "contraseña-secreta";
const EXPIRES_IN = '1h';

export function generarToken(usuario) {
  const payload = {
    id: usuario.id,
    rol: usuario.rol,
  };

  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}