import { User } from '../models/User';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

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
      const secret = req.flash('secret')[0];
      res.render('auth/verifyLogin', {
        path: '/verifyLogin',
        pageTitle: 'Verify user by GoogleAuth',
        userId: req.flash('userId'),
        errors: req.flash('errors'),
        secret: secret.base32,
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
                req.flash('userId', user._id);
                req.flash('secret', user.secret);
                return res.redirect('/verifyLogin');
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
          const secret = req.body.secret;
          const verifyCode = req.body.token;
          const verified = await speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: verifyCode,
          });
          if (verified) {
            const user = await User.findById(req.body.userId).exec();
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
              console.log(err);
              return res.redirect('/protected');
            });
          }
    }

      
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
        const secret = speakeasy.generateSecret();
        const user = new User({
          name,
          email,
          password: hashedPassword,
          secret: secret,
        });
        const result = await user.save();

        req.flash('secret', secret);
        return res.redirect('/getGoogleAuthenticator')
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

    verifyGoogleAuth = (req, res, next) => {
      const verified = speakeasy.totp.verify({
        secret: req.body.secret,
        encoding: 'base32',
        token: req.body.token
      })

      if (verified) {
        return res.redirect('/login');
      }
    }

    getGoogleAuthentication = (req, res, next) => {
      const secret = req.flash('secret')[0];
      let qrCodeUrl;
      QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
        qrCodeUrl = data_url;
        res.render('auth/addGoogleAuthentication', {
          path: '/addAuthentication',
          pageTitle: 'Add Authentication',
          qrUrl: qrCodeUrl,
          secret: secret.base32,
        });
      })
    }

}


export default new AuthController();