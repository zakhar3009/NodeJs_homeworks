import path from "node:path";
import { randomUUID } from "node:crypto";

import multer from "multer";
import type { Request } from "express";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const destination = path.resolve("src", "tmp");
    cb(null, destination);
  },
  filename: (_req, file, cb) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const uuid = randomUUID();
    const filename = `${basename}.${uuid}${extname}`;
    cb(null, filename);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
