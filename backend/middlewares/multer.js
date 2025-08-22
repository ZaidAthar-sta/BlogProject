import multer from "multer";

const storage = multer.memoryStorage(); // <== this is critical

const upload = multer({ storage });

export default upload;
