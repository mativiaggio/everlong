import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product_images", // Carpeta en Cloudinary donde se guardarán las imágenes
    format: async (req, file) => "webp", // Formato de las imágenes
    public_id: (req, file) => `${Date.now()}_${file.originalname.split(".")[0]}`, // Nombre del archivo
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: fileFilter,
});

const convertAndSave = (req, res, next) => {
  next();
};

export { upload, convertAndSave };
