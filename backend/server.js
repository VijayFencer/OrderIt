// Load environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("ERROR:", err.stack);
  console.error("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Connect to the database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start the server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("ERROR:", err.message);
  console.error("Shutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});