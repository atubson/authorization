"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("../framework/models/User.model"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const accounts = express_1.default.Router();
accounts.use(cors_1.default());
accounts.post('/register', (req, res) => {
    const registerData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        privileges: 0,
        status: 0.
    };
    User_model_1.default.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(account => {
        if (!account) {
            bcrypt_1.default.hash(req.body.password, 10, (err, hash) => {
                registerData.password = hash;
                User_model_1.default.create(registerData)
                    .then(account => {
                    res.json({ status: account.email + ' registered!' });
                })
                    .catch(err => {
                    res.send('error: ' + err);
                });
            });
        }
        else {
            res.status(400).json({ email: ['Email already taken'] });
        }
    })
        .catch(err => {
        res.send('error: ' + err);
    });
});
accounts.post('/login', (req, res) => {
    User_model_1.default.findOne({
        where: {
            email: req.body.email,
        }
    })
        .then(user => {
        if (user && user.status === 1) {
            if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
                const token = jsonwebtoken_1.default.sign({ email: user.email }, process.env.TOKEN_SECRET, {
                    expiresIn: 86400
                });
                const refreshToken = jsonwebtoken_1.default.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: 525600
                });
                const loggedUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    privileges: user.privileges,
                };
                // req.session.userId = user.id;
                // console.log(req.session);
                res.status(200).send({ token, refreshToken, user: loggedUser });
            }
            else {
                res.status(400).json({ password: ['Podane hasło jest nieprawidłowe'] });
            }
        }
        else if (!user) {
            res.status(400).json({ email: ['Użytkownik nie istnieje'] });
        }
        else if (user.status === 0) {
            res.status(400).json({ email: ['Użytkownik nieaktywny'] });
        }
    })
        .catch(err => {
        res.status(400).json({ error: err });
    });
});
exports.default = accounts;
//# sourceMappingURL=Accounts.js.map