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
const tokenVerify_1 = __importDefault(require("../../middlewares/tokenVerify"));
class UserRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.getChatUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.getChatUserService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.getSingleUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.getSingleUserService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.getLoginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.getLoginUserService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/getChatUser', tokenVerify_1.default, this.getChatUser);
        this.router.get('/getSingleUser/:id', tokenVerify_1.default, this.getSingleUser);
        this.router.get('/getLoginUser', tokenVerify_1.default, this.getLoginUser);
    }
}
exports.default = new UserRouter().router;
