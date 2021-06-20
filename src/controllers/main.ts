class MainController {

    getIndex = (req, res, next) => {
        res.render('main/index', {
            pageTitle: 'Main page',
            path: '/'
        })
    };

}


export default new MainController();