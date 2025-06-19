export const JWT_CONSTANTS = {
  secret: process.env.JWT_SECRET || 'jwt-secret-key',
  expiresIn: 86400,
};
