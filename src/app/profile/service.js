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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const statusMessage_1 = require("../../common/statusMessage");
const mongoose_1 = __importDefault(require("mongoose"));
class ProfileServices {
    updateProfileRegisterService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { username, user_id } = req.body;
                let file = req.file;
                const user_profile = yield profile_1.default.findOne({ user_id, _id: id });
                if (req.file) {
                    if (user_profile.profile_pic !== "user.jpg" &&
                        fs_1.default.existsSync(path_1.default.join(__dirname, `../public/profileImg/${user_profile.profile_pic}`))) {
                        fs_1.default.unlinkSync(path_1.default.join(__dirname, `../public/profileImg/${user_profile.profile_pic}`));
                    }
                    file = file.filename;
                }
                else {
                    file = user_profile.profile_pic;
                }
                if (user_profile) {
                    const profile = yield profile_1.default.findByIdAndUpdate(user_profile.id, { username, profile_pic: file }, { new: true });
                    const user = yield register_1.default.findByIdAndUpdate(id, {
                        username,
                    });
                    return {
                        status: statusMessage_1.RES_STATUS.E1,
                        statusCode: statusMessage_1.STATUS_CODE.EC200,
                        message: statusMessage_1.RES_MESSAGE.EM208,
                        data: profile,
                    };
                }
                else {
                    return {
                        status: statusMessage_1.RES_STATUS.E2,
                        statusCode: statusMessage_1.STATUS_CODE.EC410,
                        message: statusMessage_1.RES_MESSAGE.EM410
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
    updateProfileService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const { username } = req.body;
                const user_id = req.user.user._id;
                let file = req.file;
                console.log(id, 'id');
                console.log(user_id, 'user_id');
                const user_profile = yield profile_1.default.findOne({ _id: id, user_id });
                console.log(user_profile, 'user_profile');
                if (req.file) {
                    if ((user_profile === null || user_profile === void 0 ? void 0 : user_profile.profile_pic) !== "user.jpg" &&
                        fs_1.default.existsSync(path_1.default.join(__dirname, `../public/profileImg/${user_profile === null || user_profile === void 0 ? void 0 : user_profile.profile_pic}`))) {
                        fs_1.default.unlinkSync(path_1.default.join(__dirname, `../public/profileImg/${user_profile === null || user_profile === void 0 ? void 0 : user_profile.profile_pic}`));
                    }
                    file = file.filename;
                }
                else {
                    file = user_profile === null || user_profile === void 0 ? void 0 : user_profile.profile_pic;
                }
                if (user_profile) {
                    const profile = yield profile_1.default.findByIdAndUpdate(user_profile.id, { username: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.username) ? req.body.username : user_profile.username, profile_pic: file }, { new: true });
                    const user = yield register_1.default.findByIdAndUpdate(id, {
                        username,
                    });
                    let pic = profile === null || profile === void 0 ? void 0 : profile.profile_pic;
                    //@ts-ignore
                    profile === null || profile === void 0 ? void 0 : profile.profile_pic = `${process.env.IMAGE_ACCESS_PATH}/profileImg/${pic}`;
                    console.log(1234567890, {
                        status: statusMessage_1.RES_STATUS.E1,
                        statusCode: statusMessage_1.STATUS_CODE.EC200,
                        message: statusMessage_1.RES_MESSAGE.EM208,
                        data: profile,
                    });
                    return {
                        status: statusMessage_1.RES_STATUS.E1,
                        statusCode: statusMessage_1.STATUS_CODE.EC200,
                        message: statusMessage_1.RES_MESSAGE.EM208,
                        data: profile,
                    };
                }
                else {
                    return {
                        status: statusMessage_1.RES_STATUS.E2,
                        statusCode: statusMessage_1.STATUS_CODE.EC410,
                        message: statusMessage_1.RES_MESSAGE.EM410
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
    getProfileService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.user.user;
                const objectId = new mongoose_1.default.Types.ObjectId(_id);
                const singleUser = yield register_1.default.findById(_id);
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
                                _id: "$profiles._id",
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
            // try {
            //   const user = req.user;
            //   let file = req.file;
            //   const user_profile: any = await Profile.findOne({ user_id: id });
            //   if (req.file) {
            //     if (
            //       user_profile.profile_pic !== "user.jpg" &&
            //       fs.existsSync(
            //         path.join(__dirname, `../public/profileImg/${user_profile.profile_pic}`)
            //       )
            //     ) {
            //       fs.unlinkSync(
            //         path.join(__dirname, `../public/profileImg/${user_profile.profile_pic}`)
            //       );
            //     }
            //     file = file.filename;
            //   } else {
            //     file = user_profile.profile_pic;
            //   }
            //   if (user_profile) {
            //     const profile = await Profile.findByIdAndUpdate(
            //       user_profile.id,
            //       { username, profile_pic: file },
            //       { new: true }
            //     );
            //     const user = await Register.findByIdAndUpdate(id, {
            //       username,
            //     });
            //     return {
            //       status: RES_STATUS.E1,
            //       statusCode: STATUS_CODE.EC200,
            //       message: RES_MESSAGE.EM208,
            //       data: profile,
            //     };
            //   } else {
            //     return {
            //       status: RES_STATUS.E2,
            //       statusCode: STATUS_CODE.EC410,
            //       message: RES_MESSAGE.EM410
            //     };
            //   }
            // } catch (err: any) {
            //   console.log('Error ', err)
            //   return {
            //     status: RES_STATUS.E2,
            //     statusCode: STATUS_CODE.EC500,
            //     message: RES_MESSAGE.EM500
            //   };
            // }
        });
    }
    updateProfilePicService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { _id } = req.user.user;
                let file = req.file;
                console.log(id, _id);
                const path = process.cwd();
                const user_profile = yield profile_1.default.findOne({ _id: id, user_id: _id });
                if (req.file && user_profile) {
                    console.log('profile1', path);
                    if (user_profile.profile_pic !== "user.jpg" && fs_1.default.existsSync(`${path}/public/profileImg/${user_profile.profile_pic}`)) {
                        fs_1.default.unlinkSync(`${path}/public/profileImg/${user_profile.profile_pic}`);
                    }
                    file = file.filename;
                }
                else {
                    file = user_profile.profile_pic;
                }
                if (user_profile) {
                    const profile = yield profile_1.default.findByIdAndUpdate(id, { profile_pic: file }, { new: true });
                    const filePath = `${process.env.IMAGE_ACCESS_PATH}/profileImg/${profile === null || profile === void 0 ? void 0 : profile.profile_pic}`;
                    profile.profile_pic = filePath;
                    return {
                        status: statusMessage_1.RES_STATUS.E1,
                        statusCode: statusMessage_1.STATUS_CODE.EC200,
                        message: statusMessage_1.RES_MESSAGE.EM208,
                        data: profile,
                    };
                }
                else {
                    return {
                        status: statusMessage_1.RES_STATUS.E2,
                        statusCode: statusMessage_1.STATUS_CODE.EC410,
                        message: statusMessage_1.RES_MESSAGE.EM410
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
    removeProfilePicService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { _id } = req.user.user;
                const path = process.cwd();
                const user_profile = yield profile_1.default.findOne({ _id: id, user_id: _id });
                if (user_profile) {
                    if (user_profile.profile_pic !== "user.jpg" && fs_1.default.existsSync(`${path}/public/profileImg/${user_profile.profile_pic}`)) {
                        fs_1.default.unlinkSync(`${path}/public/profileImg/${user_profile.profile_pic}`);
                    }
                    const profile = yield profile_1.default.findByIdAndUpdate(id, { profile_pic: 'user.jpg' }, { new: true });
                    const filePath = `${process.env.IMAGE_ACCESS_PATH}/profileImg/${profile === null || profile === void 0 ? void 0 : profile.profile_pic}`;
                    profile.profile_pic = filePath;
                    return {
                        status: statusMessage_1.RES_STATUS.E1,
                        statusCode: statusMessage_1.STATUS_CODE.EC200,
                        message: statusMessage_1.RES_MESSAGE.EM208,
                        data: profile,
                    };
                }
                else {
                    return {
                        status: statusMessage_1.RES_STATUS.E2,
                        statusCode: statusMessage_1.STATUS_CODE.EC410,
                        message: statusMessage_1.RES_MESSAGE.EM410
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
}
exports.default = new ProfileServices();
