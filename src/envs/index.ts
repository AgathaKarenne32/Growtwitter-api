import "dotenv/config";

export const envs = {
  PORT: Number(process.env.PORT),
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "fallback_seguro_para_dev",
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN || "7d",
  BCRYPT_SALT: Number(process.env.BCRYPT_SALT),
};