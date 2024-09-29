"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./service"));
const multer_1 = require("../../middlewares/multer");
const tokenVerify_1 = __importDefault(require("../../middlewares/tokenVerify"));
class ProfileRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.updateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('object');
                const result = yield service_1.default.updateProfileService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.getProfileService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.updateProfilePic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.file);
                const result = yield service_1.default.updateProfilePicService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.updateProfileRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.file);
                const result = yield service_1.default.updateProfileRegisterService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.removeProfilePic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.removeProfilePicService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/update-profile-register/:id', multer_1.uploadProfile, this.updateProfileRegister);
        this.router.post('/updateProfile/:id', multer_1.uploadProfile, tokenVerify_1.default, this.updateProfile);
        this.router.get('/get-profile', tokenVerify_1.default, this.getProfile);
        this.router.post('/update-profile-pic/:id', multer_1.uploadProfile, tokenVerify_1.default, this.updateProfilePic);
        this.router.delete('/remove-profile-pic/:id', tokenVerify_1.default, this.removeProfilePic);
    }
}
exports.default = new ProfileRouter().router;
