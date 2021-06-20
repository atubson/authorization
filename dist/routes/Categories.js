"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_model_1 = __importDefault(require("../framework/models/Category.model"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const categories = express_1.default.Router();
categories.use(cors_1.default());
categories.get('/getAll', (req, res) => {
    Category_model_1.default.findAll()
        .then(searchedCategories => {
        res.status(200).send(searchedCategories);
    })
        .catch(err => {
        res.send('error: ' + err);
    });
});
categories.post('/add', (req, res) => {
    const categoryData = {
        name: req.body.name
    };
    Category_model_1.default.findOne({
        where: {
            name: req.body.name
        }
    })
        .then(category => {
        if (!category) {
            Category_model_1.default.create(categoryData)
                .then(registeredCategory => {
                res.status(200).send({ registeredCategory });
            })
                .catch(err => {
                res.send('error: ' + err);
            });
        }
        else {
            res.status(400).json({ name: ['Category already exist'] });
        }
    })
        .catch(err => {
        res.send('error: ' + err);
    });
});
exports.default = categories;
//# sourceMappingURL=Categories.js.map