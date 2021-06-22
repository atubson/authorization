"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MainController {
    constructor() {
        this.getIndex = (req, res, next) => {
            res.render('main/index', {
                pageTitle: 'Main page',
                path: '/',
                isAuthenticated: req.session.isLoggedIn,
            });
        };
        this.getProtected = (req, res, next) => {
            res.render('main/protected', {
                pageTitle: 'Protected Page',
                path: '/protected',
                isAuthenticated: req.session.isLoggedIn,
            });
        };
    }
}
exports.default = new MainController();
//# sourceMappingURL=main.js.map