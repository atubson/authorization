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
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthController {
    constructor() {
        this.getLogin = (req, res, next) => {
            res.render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                isAuthenticated: req.session.isLoggedIn
            });
        };
        this.getSignup = (req, res, next) => {
            res.render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                isAuthenticated: req.session.isLoggedIn
            });
        };
        this.getVerifyLogin = (req, res, next) => {
            res.render('auth/verifyLogin', {
                path: '/verifyLogin',
                pageTitle: 'Verify user by sms',
                isAuthenticated: false,
                userId: req.user._id,
                tokenId: req.tokenId
            });
            console.log(req.user);
            next();
        };
        this.postLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const password = req.body.password;
                const user = yield User_1.User.findOne({ email }).exec();
                if (!user) {
                    return res.redirect('/login');
                }
                const doMatch = yield bcrypt_1.default.compare(password, user.password);
                if (doMatch) {
                    const messagebird = require('messagebird')(process.env.MESSAGEBIRD_PROD_KEY);
                    messagebird.verify.create(`+${user.phone}`, {
                        template: 'Your verification code is %token.',
                        type: 'sms',
                    }, (err, response) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(response);
                            req.user = user;
                            req.tokenId = response.id;
                            return next();
                        }
                    });
                    // req.session.isLoggedIn = true;
                    // req.session.user = user;
                    // req.session.save(err => {
                    //     console.log(err);
                    //     res.redirect('/protected');
                    // });
                }
                else {
                    throw new Error('Wrong password!');
                }
            }
            catch (err) {
                console.log(err);
                if (err.message === 'Wrong password!') {
                    res.redirect('/login');
                }
            }
        });
        this.postLoginVerify = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const messagebird = require('messagebird')(process.env.MESSAGEBIRD_PROD_KEY);
            messagebird.verify.verify(req.body.tokenId, req.body.token, (err, response) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                }
                else {
                    const user = yield User_1.User.findById(req.body.userId).exec();
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save(err => {
                        console.log(err);
                        res.redirect('/protected');
                    });
                }
            }));
        });
        this.postSignup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const phone = req.body.phone;
            const confirmPassword = req.body.confirmPassword;
            try {
                const responseUser = yield User_1.User.findOne({ email }).exec();
                if (responseUser) {
                    return res.redirect('/login');
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 12);
                const user = new User_1.User({
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                });
                const result = yield user.save();
                res.redirect('/login');
            }
            catch (err) {
                console.log(err);
            }
        });
        this.postLogout = (req, res, next) => {
            req.session.destroy(err => {
                console.log(err);
                res.redirect('/');
            });
        };
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.js.map