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
const register_1 = __importDefault(require("../../model/register"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const statusMessage_1 = require("../../common/statusMessage");
class UserServices {
    getChatUserService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.user.user;
                const objectId = new mongoose_1.default.Types.ObjectId(_id);
                const users = yield register_1.default.aggregate([
                    {
                        $match: {
                            _id: { $ne: objectId },
                        },
                    },
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "_id",
                            foreignField: "user_id",
                            as: "profiles",
                        },
                    },
                    {
                        $unwind: {
                            path: "$profiles",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            email: 1,
                            phone: 1,
                            is_online: 1,
                            profile: {
                                username: "$profiles.username",
                                user_id: "$profiles.user_id",
                                profile_pic: {
                                    $cond: {
                                        if: { $ifNull: ["$profiles.profile_pic", false] },
                                        then: {
                                            $concat: [
                                                `${process.env.IMAGE_ACCESS_PATH}/profileimg/`,
                                                "$profiles.profile_pic",
                                            ],
                                        },
                                        else: null,
                                    },
                                },
                            },
                        },
                    },
                ]);
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM200,
                    data: users
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
    getSingleUserService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                const singleUser = yield register_1.default.findById(id);
                if (!singleUser) {
                    return {
                        status: statusMessage_1.RES_STATUS.E1,
                        statusCode: statusMessage_1.STATUS_CODE.EC410,
                        message: statusMessage_1.RES_MESSAGE.EM410,
                    };
                }
                const singleUsers = yield register_1.default.aggregate([
                    {
                        $match: {
                            _id: objectId,
                        },
                    },
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "_id",
                            foreignField: "user_id",
                            as: "profiles",
                        },
                    },
                    {
                        $unwind: {
                            path: "$profiles",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            sender_id: req.user.user._id,
                            _id: 1,
                            email: 1,
                            phone: 1,
                            is_online: 1,
                            profile: {
                                username: "$profiles.username",
                                user_id: "$profiles.user_id",
                                profile_pic: {
                                    $cond: {
                                        if: { $ifNull: ["$profiles.profile_pic", false] },
                                        then: {
                                            $concat: [
                                                `${process.env.IMAGE_ACCESS_PATH}/profileimg/`,
                                                "$profiles.profile_pic",
                                            ],
                                        },
                                        else: null,
                                    },
                                },
                            },
                        },
                    },
                ]);
                let user = Object.assign({}, singleUser.toObject());
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM200,
                    data: singleUsers
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
    getLoginUserService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.user.user._id;
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                const singleUser = yield register_1.default.findById(id);
                if (!singleUser) {
                    return {
                        status: statusMessage_1.RES_STATUS.E1,
                        statusCode: statusMessage_1.STATUS_CODE.EC410,
                        message: statusMessage_1.RES_MESSAGE.EM410,
                    };
                }
                const singleUsers = yield register_1.default.aggregate([
                    {
                        $match: {
                            _id: objectId,
                        },
                    },
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "_id",
                            foreignField: "user_id",
                            as: "profiles",
                        },
                    },
                    {
                        $unwind: {
                            path: "$profiles",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            sender_id: req.user.user._id,
                            _id: 1,
                            email: 1,
                            phone: 1,
                            is_online: 1,
                            profile: {
                                username: "$profiles.username",
                                user_id: "$profiles.user_id",
                                profile_pic: {
                                    $cond: {
                                        if: { $ifNull: ["$profiles.profile_pic", false] },
                                        then: {
                                            $concat: [
                                                `${process.env.IMAGE_ACCESS_PATH}/profileimg/`,
                                                "$profiles.profile_pic",
                                            ],
                                        },
                                        else: null,
                                    },
                                },
                            },
                        },
                    },
                ]);
                return {
                    status: statusMessage_1.RES_STATUS.E1,
                    statusCode: statusMessage_1.STATUS_CODE.EC200,
                    message: statusMessage_1.RES_MESSAGE.EM200,
                    data: singleUsers
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
exports.default = new UserServices();
