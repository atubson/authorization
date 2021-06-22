"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const auth = express_1.default.Router();
auth.get('/login', auth_1.default.getLogin);
auth.get('/signup', auth_1.default.getSignup);
auth.post('/login', auth_1.default.postLogin, auth_1.default.getVerifyLogin);
auth.post('/signup', auth_1.default.postSignup);
auth.post('/logout', auth_1.default.postLogout);
auth.post('/verifyLogin', auth_1.default.postLoginVerify);
exports.default = auth;
//# sourceMappingURL=Auth.js.map