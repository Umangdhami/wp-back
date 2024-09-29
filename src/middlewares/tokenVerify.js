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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Login_1 = __importDefault(require("../model/Login"));
const statusMessage_1 = require("../common/statusMessage");
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
const tokenVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        console.log(token, 'token', 8009876543211);
        if (!token) {
            console.log(token, 'invalid', 8009876543211);
            res.json({
                status: statusMessage_1.RES_STATUS.E2,
                statusCode: statusMessage_1.STATUS_CODE.EC401,
                message: statusMessage_1.RES_MESSAGE.EM12
            });
        }
        const user = yield Login_1.default.findOne({ token });
        console.log(user.token, 'use.token', 8009876543211);
        if (user) {
            jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    res.json({
                        status: statusMessage_1.RES_STATUS.E2,
                        statusCode: statusMessage_1.STATUS_CODE.EC401,
                        message: statusMessage_1.RES_MESSAGE.EM12
                    });
                    // res.status(401).json({
                    //   status: false,
                    //   message: 'Token Not Valid....',
                    // });
                }
                else {
                    if (decoded) {
                        req.user = decoded;
                        next();
                    }
                    else {
                        res.json({
                            status: statusMessage_1.RES_STATUS.E2,
                            statusCode: statusMessage_1.STATUS_CODE.EC401,
                            message: statusMessage_1.RES_MESSAGE.EM12
                        });
                        // res.status(401).json({
                        //   status: false,
                        //   message: 'Token Not Valid....',
                        // });
                    }
                }
            });
        }
        else {
            res.json({
                status: statusMessage_1.RES_STATUS.E2,
                statusCode: statusMessage_1.STATUS_CODE.EC401,
                message: statusMessage_1.RES_MESSAGE.EM12
            });
        }
        // if (token) {
        //   jwt.verify(token, secretKey, (err: any, decoded: any) => {
        //     if (err) {
        //       res.status(401).json({
        //         status: false,
        //         message: 'Token Not Valid....',
        //       });
        //     } else {
        //       if (decoded) {
        //         req.user = decoded;
        //         next();
        //       } else {
        //         res.status(401).json({
        //           status: false,
        //           message: 'Token Not Valid....',
        //         });
        //       }
        //     }
        //   });
        // } else {
        //   res.status(400).json({
        //     status: false,
        //     message: 'Please provide Token...',
        //   });
        // }
    }
    catch (error) {
        res.status(500).json({
            error: error.message,
            message: 'Internal Server Error',
        });
    }
});
exports.default = tokenVerify;
