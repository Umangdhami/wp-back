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
const profile_1 = __importDefault(require("../../model/profile"));
const register_1 = __importDefault(require("../../model/register"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRound = 10;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
const statusMessage_1 = require("../../common/statusMessage");
const Login_1 = __importDefault(require("../../model/Login"));
class AuthServices {
    userRegisterService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, conf_pass, phone } = req.body;
                console.log(req.body);
                if (password === conf_pass) {
                    const userExistEmail = yield register_1.default.findOne({ email });
                    const userExistPhone = yield register_1.default.findOne({ phone });
                    if (userExistEmail || userExistPhone) {
                        return {
                            status: statusMessage_1.RES_STATUS.E1,
                            statusCode: statusMessage_1.STATUS_CODE.EC202,
                            message: statusMessage_1.RES_MESSAGE.EM207,
                            data: null,
                        };
                    }
                    else {
                        const hashPass = yield bcrypt_1.default.hash(password, saltRound);
                        const user = new register_1.default({
                            email,
                            password: hashPass,
                            phone,
                        });
                        const profile = new profile_1.default({
                            username: "Test",
                            user_id: user.id,
                            profile_pic: "user.jpg",
                        });
                        yield profile.save();
                        yield user.save();
                        return {
                            status: statusMessage_1.RES_STATUS.E1,
                            statusCode: statusMessage_1.STATUS_CODE.EC200,
                            message: statusMessage_1.RES_MESSAGE.EM201,
                            data: user,
                            profile: profile
                        };
                    }
                }
                else {
                    return {
                        statusCode: statusMessage_1.STATUS_CODE.EC400,
                        status: statusMessage_1.RES_STATUS.E2,
                        message: statusMessage_1.RES_MESSAGE.EM206
                    };
                }
            }
            catch (err) {
                console.log('Error ', err);
                return {
                    message: statusMessage_1.RES_MESSAGE.EM500,
                    statusCode: statusMessage_1.STATUS_CODE.EC500,
                    status: statusMessage_1.RES_STATUS.E2
                };
            }
        });
    }
    userLoginService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const loginUser = yield Login_1.default.findOne({ email });
                if (loginUser) {
                    let valid = yield jsonwebtoken_1.default.verify(loginUser.token, secretKey, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            return false;
                        }
                        if (decoded) {
                            return true;
                        }
                    }));
                    if (valid) {
                        return {
                            status: statusMessage_1.RES_STATUS.E1,
                            statusCode: statusMessage_1.STATUS_CODE.EC400,
                            message: statusMessage_1.RES_MESSAGE.EM102,
                        };
                    }
                    else {
                        // await Login.findByIdAndDelete(loginUser.id);
                        // return {
                        //     status: RES_STATUS.E2,
                        //     statusCode: STATUS_CODE.EC401,
                        //     message: RES_MESSAGE.EM12
                        // };
                        const user = yield register_1.default.findOne({ email });
                        if (user) {
                            const dPass = yield bcrypt_1.default.compare(password, user.password);
                            if (dPass) {
                                const token = jsonwebtoken_1.default.sign({ user }, secretKey, { expiresIn: "3d" });
                                // const login = await new Login({
                                //     user_id: user.id,
                                //     email,
                                //     password: user.password,
                                //     token,
                                // });
                                // login.save();
                                // console.log('login done')
                                const login = yield Login_1.default.findByIdAndUpdate(loginUser._id, {
                                    token
                                });
                                // console.log('login done')
                                return {
                                    status: statusMessage_1.RES_STATUS.E1,
                                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                                    message: statusMessage_1.RES_MESSAGE.EM200,
                                    data: Object.assign(Object.assign({}, user), { token }),
                                };
                            }
                            else {
                                return {
                                    status: statusMessage_1.RES_STATUS.E2,
                                    statusCode: statusMessage_1.STATUS_CODE.EC400,
                                    message: statusMessage_1.RES_MESSAGE.EM206,
                                };
                            }
                        }
                        else {
                            return {
                                status: statusMessage_1.RES_STATUS.E2,
                                statusCode: statusMessage_1.STATUS_CODE.EC410,
                                message: statusMessage_1.RES_MESSAGE.EM212,
                            };
                        }
                    }
                }
                else {
                    const user = yield register_1.default.findOne({ email });
                    if (user) {
                        const dPass = yield bcrypt_1.default.compare(password, user.password);
                        if (dPass) {
                            const token = jsonwebtoken_1.default.sign({ user }, secretKey, { expiresIn: "3d" });
                            const login = yield new Login_1.default({
                                user_id: user.id,
                                email,
                                password: user.password,
                                token,
                            });
                            login.save();
                            console.log('login done');
                            return {
                                status: statusMessage_1.RES_STATUS.E1,
                                statusCode: statusMessage_1.STATUS_CODE.EC200,
                                message: statusMessage_1.RES_MESSAGE.EM200,
                                data: Object.assign(Object.assign({}, user), { token }),
                            };
                        }
                        else {
                            return {
                                status: statusMessage_1.RES_STATUS.E2,
                                statusCode: statusMessage_1.STATUS_CODE.EC400,
                                message: statusMessage_1.RES_MESSAGE.EM206,
                            };
                        }
                    }
                    else {
                        return {
                            status: statusMessage_1.RES_STATUS.E2,
                            statusCode: statusMessage_1.STATUS_CODE.EC410,
                            message: statusMessage_1.RES_MESSAGE.EM212,
                        };
                    }
                }
                // if (loginUser) {
                //     jwt.verify(loginUser.token, secretKey, async (err: any, decoded: any) => {
                //         if (err) {
                //             await Login.findByIdAndDelete(loginUser.id);
                //             return {
                //                 status: RES_STATUS.E2,
                //                 statusCode: STATUS_CODE.EC401,
                //                 message: RES_MESSAGE.EM12
                //             };
                //         }
                //         if (decoded) {
                //             return {
                //                 status: RES_STATUS.E1,
                //                 statusCode: STATUS_CODE.EC400,
                //                 message: RES_MESSAGE.EM102,
                //             };
                //         }
                //     });
                // } else {
                //     const user: any = await Register.findOne({ email });
                //     if (user) {
                //         const dPass = await bcrypt.compare(password, user.password);
                //         if (dPass) {
                //             const token = jwt.sign({ user }, secretKey, { expiresIn: "10s" });
                //             const login = await new Login({
                //                 user_id: user.id,
                //                 email,
                //                 password: user.password,
                //                 token,
                //             });
                //             login.save();
                //             console.log('login done')
                //             return {
                //                 status: RES_STATUS.E1,
                //                 statusCode: STATUS_CODE.EC200,
                //                 message: RES_MESSAGE.EM200,
                //                 data: { ...user, token },
                //             };
                //         } else {
                //             return {
                //                 status: RES_STATUS.E2,
                //                 statusCode: STATUS_CODE.EC400,
                //                 message: RES_MESSAGE.EM206,
                //             };
                //         }
                //     } else {
                //         return {
                //             status: RES_STATUS.E2,
                //             statusCode: STATUS_CODE.EC410,
                //             message: RES_MESSAGE.EM212,
                //         };
                //     }
                // }
            }
            catch (err) {
                console.log('Error ', err);
                return {
                    message: statusMessage_1.RES_MESSAGE.EM500,
                    statusCode: statusMessage_1.STATUS_CODE.EC500,
                    status: statusMessage_1.RES_STATUS.E2
                };
            }
        });
    }
    tokenVallidService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return {
                        status: statusMessage_1.RES_STATUS.E2,
                        statusCode: statusMessage_1.STATUS_CODE.EC401,
                        message: statusMessage_1.RES_MESSAGE.EM11,
                    };
                }
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM10,
                };
            }
            catch (err) {
                console.log('Error ', err);
                return {
                    message: statusMessage_1.RES_MESSAGE.EM500,
                    statusCode: statusMessage_1.STATUS_CODE.EC500,
                    status: statusMessage_1.RES_STATUS.E2
                };
            }
        });
    }
}
exports.default = new AuthServices();
