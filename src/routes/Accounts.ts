import User from '../framework/models/User.model';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const accounts = express.Router();

accounts.use(cors());

accounts.post('/register', (req, res) => {
    const registerData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        privileges: 0,
        status: 0.
    };
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(account => {
        if (!account) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                registerData.password = hash;
                User.create(registerData)
                .then(account => {
                    res.json({status: account.email + ' zarejestrowany!'})
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
            })
        } else {
            res.status(400).json({ email: ['Email jest zajęty']})
        }
    })
    .catch(err => {
        res.send('error: ' + err);
    })
})

accounts.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email,
        }
    })
    .then(user => {
        if (user && user.status === 1) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, {
                    expiresIn: 86400
                });
                const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: 525600
                });
                const loggedUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    privileges: user.privileges,
                };
                
                res.status(200).send({ token, refreshToken, user: loggedUser });
            } else {
                res.status(400).json({ password: ['Podane hasło jest nieprawidłowe' ]});
            }
        } else if (!user) {
            res.status(400).json({ email: ['Użytkownik nie istnieje'] });
        } else if (user.status === 0) {
            res.status(400).json({ email: ['Użytkownik nieaktywny'] });
        }
    })
    .catch(err => {
        res.status(400).json({ error: err });
    })
})

export default accounts;