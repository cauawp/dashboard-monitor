import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const MONGODB_URI = process.env.MONGODB_URI!;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const MONGOMS_DOWNLOAD_DIR = process.env.MONGOMS_DOWNLOAD_DIR!;
