import dotenv from "dotenv";
dotenv.config()
const PORT = process.env.PORT || 3000
const URI = process.env.URI || null
const SECRET = process.env.SECRET || null
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || null
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUD_NAME = process.env.CLOUD_NAME


export {
  PORT,
  URI,
  SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUD_NAME
}