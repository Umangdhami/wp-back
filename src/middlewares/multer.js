"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfile = void 0;
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // if(!fs.existsSync(path.join(__dirname, `${process.env.PROFILE_IMAGE}`))){
        //   fs.mkdirSync(path.join(__dirname, `${process.env.PROFILE_IMAGE}`));
        // }
        cb(null, path_1.default.join(__dirname, `${process.env.PROFILE_IMAGE}`));
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "-" + Math.round(Math.random() * 100000) + "-" + file.originalname;
        cb(null, fileName);
    },
});
const uploadProfile = (0, multer_1.default)({ storage }).single("profile_pic");
exports.uploadProfile = uploadProfile;
