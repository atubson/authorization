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
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenRefresh = express_1.default.Router();
tokenRefresh.use(cors_1.default());
tokenRefresh.post('/tokenRefresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    const user = req.body.user;
    if (!refreshToken) {
        return res.status(401);
    }
    try {
        yield jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        return res.sendStatus(403);
    }
    const accessToken = jsonwebtoken_1.default.sign({ email: user.email }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
    res.send({ accessToken });
}));
exports.default = tokenRefresh;
//# sourceMappingURL=TokenRefresh.js.map