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
class NotificationRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.getNotificationChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_1.default.getNotificationChatService(req);
                res.json(result);
            }
            catch (error) {
                res.send(error);
            }
        });
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/get-notification-chat', this.getNotificationChat);
    }
}
exports.default = new NotificationRouter().router;
