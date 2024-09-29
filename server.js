"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const moment_1 = __importDefault(require("moment"));
const dbConnection_1 = __importDefault(require("./src/config/dbConnection"));
const socket_1 = require("./src/config/socket");
dbConnection_1.default;
const route_1 = __importDefault(require("./src/app/auth/route"));
const route_2 = __importDefault(require("./src/app/profile/route"));
const route_3 = __importDefault(require("./src/app/user/route"));
const route_4 = __importDefault(require("./src/app/chat/route"));
const route_5 = __importDefault(require("./src/app/notification/route"));
const app = (0, express_1.default)();
const port = 5011;
const secretKey = process.env.SECRET_KEY;
const getCurrentTime = () => (0, moment_1.default)().format("HH:mm");
// Create HTTP server
const server = (0, http_1.createServer)(app);
// Initialize Socket.IO server with CORS options
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});
// CORS configuration
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
// Static file serving
app.use(express_1.default.static(path_1.default.join(process.cwd(), "./public/")));
// app.use(express.static(path.join(__dirname, './public/')));
console.log('ok path', process.cwd());
app.use(`${process.env.IMAGE_FILE}`, express_1.default.static(`.${process.env.IMAGE_FILE}`));
// Set view engine to EJS
app.set("view engine", "ejs");
// Body parser middleware
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Initialize Socket.IO namespace for users
(0, socket_1.initSocket)(io);
app.get("/umang", (req, res) => res.send('umang'));
app.use("/api/auth", route_1.default);
app.use("/api/profile", route_2.default);
app.use("/api/user", route_3.default);
app.use("/api/chat", route_4.default);
app.use("/api/notification", route_5.default);
// Route handling
// Start the server
// const dirPath2 = process.cwd();
// fs.readdir(dirPath2, (err, files) => {
//   if (err) {
//     console.error('Error reading directory:', err);
//     return;
//   }
//   const folders = files.filter(file => fs.statSync(path.join(dirPath, file)).isDirectory());
//   console.log(`Folders: ${folders.join(', ')}`);
// });
// const dirPath = process.cwd()+'/dist';
// fs.readdir(dirPath, (err, files) => {
//   if (err) {
//     console.error('Error reading directory:', err);
//     return;
//   }
//   const folders = files.filter(file => fs.statSync(path.join(dirPath, file)).isDirectory());
//   console.log(`Folders: ${folders.join(', ')}`);
// });
// console.log(express.static(process.cwd() + "./public/"))
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
