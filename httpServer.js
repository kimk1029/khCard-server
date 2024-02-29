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
const mysql_1 = __importDefault(require("mysql"));
const express_session_1 = __importDefault(require("express-session"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
// 데이터베이스 설정
const db = mysql_1.default.createPool({
    host: "localhost",
    user: "yourUsername",
    password: "yourPassword",
    database: "yourDatabase",
});
// 세션 미들웨어 설정
app.use((0, express_session_1.default)({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // 배포시에는 true로 설정하세요.
}));
// JSON 요청 본문 파싱을 위한 미들웨어
app.use(express_1.default.json());
// 회원가입 라우트
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err)
            return res.status(500).send(err);
        res.status(200).send("User successfully registered.");
    });
}));
// 로그인 라우트
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(500).send(err);
        if (results.length > 0) {
            const comparison = yield bcrypt_1.default.compare(password, results[0].password);
            if (comparison) {
                //@ts-ignore
                req.session.userId = results[0].id;
                return res.status(200).send("Logged in successfully.");
            }
        }
        res.status(401).send("Username or password is incorrect.");
    }));
});
// 로그아웃 라우트
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err)
            return res.status(500).send("Could not log out.");
        res.status(200).send("Logged out successfully.");
    });
});
exports.default = app;
