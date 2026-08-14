import rateLimit from "express-rate-limit";

// Limiter general para toda la API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP en esa ventana
  message: { mensaje: "Demasiadas solicitudes, intentá de nuevo más tarde" },
  standardHeaders: true, // devuelve info en headers RateLimit-*
  legacyHeaders: false,
});

// Limiter estricto para login (evita fuerza bruta)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // solo 5 intentos de login por IP
  message: { mensaje: "Demasiados intentos de login, intentá de nuevo en 15 minutos" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // los logins exitosos no cuentan para el límite
});