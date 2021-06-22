class MainController {

    getIndex = (req, res, next) => {
        res.render('main/index', {
            pageTitle: 'Main page',
            path: '/',
        })
    };

    getProtected = (req, res, next) => {
        res.render('main/protected', {
            pageTitle: 'Protected Page',
            path: '/protected',
        });
    }

}


export default new MainController();