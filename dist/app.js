"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const DB_1 = __importDefault(require("./framework/DB"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Accounts_1 = __importDefault(require("./routes/Accounts"));
const Categories_1 = __importDefault(require("./routes/Categories"));
const TokenRefresh_1 = __importDefault(require("./routes/TokenRefresh"));
dotenv_1.default.config();
const SequelizeStore = require("connect-session-sequelize")(express_session_1.default.Store);
const dbClient = DB_1.default.client;
// const TWO_HOURS = 1000 * 60 * 60 * 2;
// const {
//     SESS_LIFETIME = TWO_HOURS,
//     SESS_SECRET = 'djoDaT08Wu',
// } = process.env;
// const sessionStore = new SequelizeStore({
//     db: dbClient,
// });
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.writeHead(301, { Location: 'http://localhost:8080/login' });
    }
    else {
        next();
    }
};
app.use('/auth', TokenRefresh_1.default);
app.use('/accounts', Accounts_1.default);
app.use('/categories', Categories_1.default);
app.get('/', (req, res) => {
    res.send('Hello');
});
app.listen(5001, () => console.log('Server running'));
//# sourceMappingURL=app.js.map