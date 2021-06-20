import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import DB from './framework/DB';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import accounts from './routes/Accounts';
import main from './routes/Main';
import ejs from 'ejs';
import path from 'path';

declare module 'express-session' {
    export interface SessionData {
        userId: number;
    }
}

dotenv.config();
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const dbClient = DB.client;

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }

        req.user = user;
        next()
    });
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.writeHead(301, { Location: 'http://localhost:5000/login' });
    } else {
        next();
    }
}

app.use('/accounts', accounts);
app.use(main);

app.listen(5000, () => console.log('Server running'));
