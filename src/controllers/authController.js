import * as authService from '../services/authService.js';

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y password son obligatorios' });
  }

  try {
    const resultado = await authService.login(email, password);
    return res.status(200).json(resultado);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ mensaje: error.message || 'Error en el servidor' });
  }
}