import express from 'express';
import  AuthController  from '../controllers/auth';
const auth = express.Router();

auth.get('/login', AuthController.getLogin);

auth.get('/signup', AuthController.getSignup);

auth.post('/login', AuthController.postLogin, AuthController.getVerifyLogin);

auth.post('/signup', AuthController.postSignup);

auth.post('/logout', AuthController.postLogout);

auth.post('/verifyLogin', AuthController.postLoginVerify);

export default auth;