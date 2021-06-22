"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const main_1 = __importDefault(require("../controllers/main"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const main = express_1.default.Router();
main.get('/', main_1.default.getIndex);
main.get('/protected', is_auth_1.default, main_1.default.getProtected);
exports.default = main;
//# sourceMappingURL=Main.js.map