import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const id = uuid();

    const extname = file.originalname.split(".").pop();
    // ["profile-picture", "jpg"].
    // Therefore, .pop() returns "jpg"
    cb(null, `${id}.${extname}`);
  },
});

export const singleUpload = multer({ storage: storage }).single("photo");
