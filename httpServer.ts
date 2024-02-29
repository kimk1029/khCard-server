import express, { Request, Response } from "express";
import mysql from "mysql";
import session from "express-session";
import bcrypt from "bcrypt";

const app = express();

// 데이터베이스 설정
const db = mysql.createPool({
  host: "localhost",
  user: "yourUsername",
  password: "yourPassword",
  database: "yourDatabase",
});

// 세션 미들웨어 설정
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // 배포시에는 true로 설정하세요.
  })
);

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(express.json());

// 회원가입 라우트
app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).send("User successfully registered.");
    }
  );
});

// 로그인 라우트
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).send(err);

      if (results.length > 0) {
        const comparison = await bcrypt.compare(password, results[0].password);
        if (comparison) {
          //@ts-ignore
          req.session.userId = results[0].id;
          return res.status(200).send("Logged in successfully.");
        }
      }
      res.status(401).send("Username or password is incorrect.");
    }
  );
});

// 로그아웃 라우트
app.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Could not log out.");
    res.status(200).send("Logged out successfully.");
  });
});

export default app;
