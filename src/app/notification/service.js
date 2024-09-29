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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const statusMessage_1 = require("../../common/statusMessage");
const chat_1 = __importDefault(require("../../model/chat"));
class NotificationServices {
    getNotificationChatService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reciver_id, sender_id } = req.body;
                const chats = yield chat_1.default.find({
                    reciver_id: reciver_id,
                    sender_id: sender_id,
                    is_read: 0,
                });
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM200,
                    data: chats
                };
            }
            catch (err) {
                console.log('Error ', err);
                return {
                    status: statusMessage_1.RES_STATUS.E2,
                    statusCode: statusMessage_1.STATUS_CODE.EC500,
                    message: statusMessage_1.RES_MESSAGE.EM500
                };
            }
        });
    }
}
exports.default = new NotificationServices();
