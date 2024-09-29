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
const moment_1 = __importDefault(require("moment"));
const statusMessage_1 = require("../../common/statusMessage");
const chat_1 = __importDefault(require("../../model/chat"));
const getCurrentTime = () => (0, moment_1.default)().format("HH:mm");
class ChatServices {
    saveChatService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reciver_id, message, username } = req.body;
                const { _id } = req.user.user;
                const chat = yield new chat_1.default({
                    sender_id: _id,
                    reciver_id,
                    message,
                    sent_time: getCurrentTime(),
                    reciver_username: username,
                    sender_username: req.user.user.username,
                    is_send: 1,
                });
                chat.save();
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM200,
                    data: Object.assign(Object.assign({}, chat), { device_id: _id })
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
    getChatService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reciver_id } = req.body;
                const { _id } = req.user.user;
                const chats = yield chat_1.default.aggregate([
                    {
                        $match: {
                            $or: [
                                { sender_id: _id, reciver_id: reciver_id },
                                { sender_id: reciver_id, reciver_id: _id },
                            ],
                        },
                    },
                ]);
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
    updateChatService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { msg } = req.body;
                const { id } = req.params;
                const chat = yield chat_1.default.findByIdAndUpdate(id, { message: msg, edited: 1 }, { new: true });
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM208,
                    data: chat
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
    chatSendService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const chat = yield chat_1.default.findById(_id);
                if (chat) {
                    return {
                        status: statusMessage_1.RES_STATUS.E1,
                        statusCode: statusMessage_1.STATUS_CODE.EC200,
                        message: statusMessage_1.RES_MESSAGE.EM200,
                        data: chat
                    };
                }
                else {
                    return {
                        status: statusMessage_1.RES_STATUS.E1,
                        statusCode: statusMessage_1.STATUS_CODE.EC410,
                        message: statusMessage_1.RES_MESSAGE.EM410,
                    };
                }
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
    reciveChatSuccessService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const update = yield chat_1.default.findByIdAndUpdate(id, {
                    is_recived: 1,
                }, { new: true });
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM208,
                    data: update
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
    deleteChatUsersideService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const chat = yield chat_1.default.findByIdAndUpdate(id, {
                    delete_me: 1,
                });
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM210,
                    data: chat
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
    deleteChatBothsideService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const chat = yield chat_1.default.findByIdAndUpdate(id, { delete_everyone: 1 }, { new: true });
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM210,
                    data: chat
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
exports.default = new ChatServices();
