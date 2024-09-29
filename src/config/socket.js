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
exports.initSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register_1 = __importDefault(require("../model/register"));
const chat_1 = __importDefault(require("../model/chat"));
const secretKey = process.env.SECRET_KEY;
const initSocket = (io) => {
    const usp = io.of("/api/socket/user-namespace");
    usp.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        const token = socket.handshake.auth.token;
        // console.log('socket connection', token)
        jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("Token verification failed:", err);
                socket.disconnect();
            }
            else {
                try {
                    const id = decoded.user._id;
                    yield register_1.default.findByIdAndUpdate(id, { is_online: "1" });
                    socket.broadcast.emit("getOnlineUser", id);
                    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
                        try {
                            yield register_1.default.findByIdAndUpdate(id, { is_online: "0" });
                            socket.broadcast.emit("getOfflineUser", id);
                        }
                        catch (error) {
                            console.error("Error updating user's online status:", error);
                        }
                    }));
                    socket.on("chatRead", (data) => __awaiter(void 0, void 0, void 0, function* () {
                        if (data.length != 0) {
                            const unreadChats = data.filter((chat) => chat.is_read == 0);
                            unreadChats.forEach((chat) => __awaiter(void 0, void 0, void 0, function* () {
                                yield chat_1.default.findByIdAndUpdate(chat._id, { is_read: 1 });
                            }));
                            socket.broadcast.emit("chatReadSuccess", unreadChats);
                        }
                    }));
                    socket.on("chatReciveNotification", (data) => {
                        socket.broadcast.emit("chatReciveNotificationSuccess", data);
                    });
                    socket.on("newChat", (data) => __awaiter(void 0, void 0, void 0, function* () {
                        jsonwebtoken_1.default.verify(data.token, secretKey, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                            if (err) {
                                console.error("Token verification failed:", err);
                                socket.disconnect();
                            }
                            else {
                                const { sender_id, reciver_id, sent_time, message, username, _id } = data;
                                let chat = new chat_1.default({
                                    _id: _id,
                                    reciver_username: username,
                                    sender_username: decoded.user.username,
                                    sender_id,
                                    reciver_id,
                                    is_send: 1,
                                    sent_time,
                                    message,
                                });
                                yield chat.save();
                                socket.broadcast.emit("loadNewChat", chat);
                            }
                        }));
                    }));
                    socket.on("chatSend", (data) => {
                        socket.broadcast.emit("chatSendSuccess", data);
                        socket.broadcast.emit("chatSendSuccess2", data);
                    });
                    socket.on("delete-chat", (id, senderId) => __awaiter(void 0, void 0, void 0, function* () {
                        const chat = yield chat_1.default.findById(id);
                        if (chat) {
                            socket.broadcast.emit("chatMessageDeleted", chat, senderId);
                        }
                        else {
                            socket.broadcast.emit("chatMessageDeleted", id, senderId);
                        }
                    }));
                    socket.on("chatRecived", (id) => __awaiter(void 0, void 0, void 0, function* () {
                        const chat = yield chat_1.default.findByIdAndUpdate(id, { is_recived: 1 }, { new: true });
                        socket.broadcast.emit("chatRecivedSuccess", chat);
                    }));
                    socket.on("editChat", (data) => {
                        socket.broadcast.emit("updateChat", data);
                    });
                    socket.on('reciveChat', () => {
                        socket.broadcast.emit('reciveChatToUser');
                    });
                }
                catch (error) {
                    console.error("Error updating user's online status:", error);
                    socket.disconnect();
                }
            }
        }));
    }));
};
exports.initSocket = initSocket;
