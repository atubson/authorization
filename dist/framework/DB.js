"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
class DB {
    static get client() {
        if (!this.clientSequelize) {
            this.clientSequelize = new sequelize_typescript_1.Sequelize(this.databaseName, this.databaseUser, this.databasePassword, {
                dialect: 'mysql',
                models: [__dirname + '/models']
            });
        }
        return this.clientSequelize;
    }
}
exports.default = DB;
DB.databaseName = 'marketplace_db';
DB.databaseUser = 'root';
DB.databasePassword = 'password';
//# sourceMappingURL=DB.js.map