"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_URL;
const databaseName = process.env.DATABASE_NAME;
mongoose_1.default.connect(`${databaseUrl}${databaseName}`)
    .then(() => {
    console.log('Database Connected...');
})
    .catch((err) => {
    console.error('Database Error...', err);
});
exports.default = mongoose_1.default;
