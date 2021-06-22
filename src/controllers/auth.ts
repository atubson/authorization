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

    getVerifyLogin = (req, res, next) => {
      res.render('auth/verifyLogin', {
        path: '/verifyLogin',
        pageTitle: 'Verify user by sms',
        isAuthenticated: false,
        userId: req.user._id,
        tokenId: req.tokenId
      })
      console.log(req.user);
      next();
    }
      
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
              const messagebird = require('messagebird')(process.env.MESSAGEBIRD_PROD_KEY);
              messagebird.verify.create(`+${user.phone}`, {
                template: 'Your verification code is %token.',
                type: 'sms',
              }, (err, response) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(response);
                  req.user = user;
                  req.tokenId = response.id;
                  return next();
                }
              })
              // req.session.isLoggedIn = true;
              // req.session.user = user;
              // req.session.save(err => {
              //     console.log(err);
              //     res.redirect('/protected');
              // });
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

    postLoginVerify = async (req, res, next) => {
      const messagebird = require('messagebird')(process.env.MESSAGEBIRD_PROD_KEY);
      messagebird.verify.verify(req.body.tokenId, req.body.token, async (err, response) => {
        if (err) {
          console.log(err);
        } else {
          const user = await User.findById(req.body.userId).exec();
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            console.log(err);
            res.redirect('/protected');
          });
        }
      })
    }
      
    postSignup = async (req, res, next) => {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const phone = req.body.phone;
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
          phone,
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