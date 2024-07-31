// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, "../public/images/products");
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const extension = path.extname(file.originalname);
//     cb(null, `${Date.now()}${extension}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5, // 5MB
//   },
//   fileFilter: fileFilter,
// });

// export default upload;

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage(); // Store files in memory for processing

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

const convertAndSave = async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const dir = path.join(__dirname, "../public/images/products");
  fs.mkdirSync(dir, { recursive: true });

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const filename = `${Date.now()}_${file.originalname}.webp`;
        const filepath = path.join(dir, filename);

        await sharp(file.buffer).webp().toFile(filepath);

        file.path = filepath;
        file.filename = filename;
      })
    );
    next();
  } catch (error) {
    next(error);
  }
};

export { upload, convertAndSave };
