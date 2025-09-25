import dotenv from "dotenv";
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://mongo:27017/Consultora",
  JWT_SECRET: process.env.JWT_SECRET || "devsecret",

  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",

  S3_BUCKET: process.env.S3_BUCKET,
  S3_KEY: process.env.S3_KEY,
  S3_SECRET: process.env.S3_SECRET,

  UNSPLASH_KEY: process.env.UNSPLASH_KEY || ""
};
export default env;


//wivz srxn rrzw vacf
