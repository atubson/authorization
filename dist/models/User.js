"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true }
});
exports.User = mongoose_1.model('User', schema);
//# sourceMappingURL=User.js.map