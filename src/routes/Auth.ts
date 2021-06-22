import express from 'express';
import  AuthController  from '../controllers/auth';
const auth = express.Router();

auth.get('/login', AuthController.getLogin);

auth.get('/signup', AuthController.getSignup);

auth.post('/login', AuthController.postLogin);

auth.post('/signup', AuthController.postSignup);

auth.post('/logout', AuthController.postLogout);

auth.get('/verifyLogin', AuthController.getVerifyLogin);

auth.post('/verifyLogin', AuthController.postLoginVerify);

auth.get('/getGoogleAuthenticator', AuthController.getGoogleAuthentication);

auth.post('/verifyGoogleAuth', AuthController.verifyGoogleAuth);

export default auth;