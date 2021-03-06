import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import main from './routes/Main';
import auth from './routes/Auth';
import ejs from 'ejs';
import path from 'path';
import mongoose from 'mongoose';
import { User } from './models/User';
import session from 'express-session';
import csrf from 'csurf';
import flash from 'connect-flash';


dotenv.config();
const MongodbStore =  require('connect-mongodb-session')(session);
const MONGODB_URI = `mongodb+srv://atubs:${process.env.MONGODB_PASSWORD}@authorization.uuucj.mongodb.net/myFirstDatabase`;
const messagebird = require('messagebird')(process.env.MESSAGEBIRD_TEST_KEY);
const csrfProtection = csrf();

const app = express();
const store = new MongodbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

declare module 'express-session' {
    export interface SessionData {
        isLoggedIn: boolean,
    }
}

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
}))
app.use(csrfProtection);
app.use(flash());



const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.writeHead(301, { Location: 'http://localhost:5000/login' });
    } else {
        next();
    }
}
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use(auth);
app.use(main);

(async function() {
    try {
        await mongoose.connect(MONGODB_URI + '?retryWrites=true&w=majority');
        app.listen(5000, () => console.log('Server running'));
    } catch(err) {
        console.log(err);
    }
})();

