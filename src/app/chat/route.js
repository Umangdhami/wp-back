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
class ChatRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.saveChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.saveChatService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.getChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.getChatService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.updateChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.updateChatService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.chatSend = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.chatSendService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.reciveChatSuccess = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.reciveChatSuccessService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.deleteChatUserside = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.deleteChatUsersideService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.deleteChatBothside = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.deleteChatBothsideService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/save-chat', tokenVerify_1.default, this.saveChat);
        this.router.post('/get-chat', tokenVerify_1.default, this.getChat);
        this.router.post('/update-chat/:id', tokenVerify_1.default, this.updateChat);
        this.router.post('/chat-send', tokenVerify_1.default, this.chatSend);
        this.router.post('/recive-chat-success', tokenVerify_1.default, this.reciveChatSuccess);
        this.router.get('/delete-chat-userside/:id', tokenVerify_1.default, this.deleteChatUserside);
        this.router.get('/delete-chat-bothside/:id', tokenVerify_1.default, this.deleteChatBothside);
    }
}
exports.default = new ChatRouter().router;
