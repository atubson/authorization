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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const Main_1 = __importDefault(require("./routes/Main"));
const Auth_1 = __importDefault(require("./routes/Auth"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
const MongodbStore = require('connect-mongodb-session')(express_session_1.default);
const MONGODB_URI = `mongodb+srv://atubs:${process.env.MONGODB_PASSWORD}@authorization.uuucj.mongodb.net/myFirstDatabase`;
const messagebird = require('messagebird')(process.env.MESSAGEBIRD_TEST_KEY);
const app = express_1.default();
const store = new MongodbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_session_1.default({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
}));
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.writeHead(301, { Location: 'http://localhost:5000/login' });
    }
    else {
        next();
    }
};
app.use(Auth_1.default);
app.use(Main_1.default);
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI + '?retryWrites=true&w=majority');
            app.listen(5000, () => console.log('Server running'));
        }
        catch (err) {
            console.log(err);
        }
    });
})();
//# sourceMappingURL=app.js.map