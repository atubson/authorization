import express from 'express';
import  MainController  from '../controllers/main';
import isAuth from '../middleware/is-auth';

const main = express.Router();

main.get('/', MainController.getIndex);
main.get('/protected', isAuth, MainController.getProtected);

export default main;