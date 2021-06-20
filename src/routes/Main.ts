import express from 'express';
import  MainController  from '../controllers/main';
const main = express.Router();

main.get('/', MainController.getIndex);

export default main;