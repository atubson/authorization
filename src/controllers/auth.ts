import { User } from '../models/User';
import bcrypt from 'bcrypt';

class AuthController {

    getLogin = (req, res, next) => {
        res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          isAuthenticated: req.session.isLoggedIn
        });
    };
      
    getSignup = (req, res, next) => {
        res.render('auth/signup', {
          path: '/signup',
          pageTitle: 'Signup',
          isAuthenticated: req.session.isLoggedIn
        });
    };
      
    postLogin = async (req, res, next) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({ email }).exec();
            if (!user) {
              return res.redirect('/login');
            }

            const doMatch = await bcrypt.compare(password, user.password);
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              req.session.save(err => {
                  console.log(err);
                  res.redirect('/protected');
              });
            } else {
              throw new Error('Wrong password!');
            }
        } catch(err) {
            console.log(err);
            if (err.message === 'Wrong password!') {
              res.redirect('/login');
            }
        }
    };
      
    postSignup = async (req, res, next) => {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;
      try {
        const responseUser = await User.findOne({ email }).exec();
        if (responseUser) {
          return res.redirect('/login');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        const result = await user.save();
        res.redirect('/login')
      } catch (err) {
        console.log(err);
      }
    };
      
    postLogout = (req, res, next) => {
        req.session.destroy(err => {
          console.log(err);
          res.redirect('/');
        });
    };

}


export default new AuthController();