class MainController {

    getIndex = (req, res, next) => {
        res.render('main/index', {
            pageTitle: 'Main page',
            path: '/',
            isAuthenticated: req.session.isLoggedIn,
        })
    };

    getProtected = (req, res, next) => {
        res.render('main/protected', {
            pageTitle: 'Protected Page',
            path: '/protected',
            isAuthenticated: req.session.isLoggedIn,
        });
    }

}


export default new MainController();