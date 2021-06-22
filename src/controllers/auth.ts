import { User } from '../models/User';
import bcrypt from 'bcrypt';

class AuthController {

    getLogin = (req, res, next) => {
        res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: req.flash('error'),
        });
    };
      
    getSignup = (req, res, next) => {
        res.render('auth/signup', {
          path: '/signup',
          pageTitle: 'Signup',
        });
    };

    getVerifyLogin = (req, res, next) => {
      res.render('auth/verifyLogin', {
        path: '/verifyLogin',
        pageTitle: 'Verify user by sms',
        userId: req.flash('userId'),
        tokenId: req.flash('tokenId'),
        errors: req.flash('errors'),
      })
    }
      
    postLogin = async (req, res, next) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({ email }).exec();
            if (!user) {
              req.flash('error', 'Invalid email or password.')
              return res.redirect('/login');
            }

            const doMatch = await bcrypt.compare(password, user.password);
            if (doMatch) {
              const messagebird = require('messagebird')(process.env.MESSAGEBIRD_TEST_KEY);
              messagebird.verify.create(`+${user.phone}`, {
                template: 'Your verification code is %token.',
                type: 'sms',
              }, (err, response) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(response);
                  req.flash('userId', user._id);
                  req.flash('tokenId', response.id);
                  return res.redirect('/verifyLogin');
                }
              })
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
      const messagebird = require('messagebird')(process.env.MESSAGEBIRD_TEST_KEY);
      messagebird.verify.verify(req.body.tokenId, req.body.token, async (err, response) => {
        if (err) {
          req.flash('userId', req.body.userId);
          req.flash('tokenId', req.body.tokenId);
          req.flash('errors', err.errors);
          return res.redirect('/verifyLogin');
        } else {
          const user = await User.findById(req.body.userId).exec();
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            console.log(err);
            return res.redirect('/protected');
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