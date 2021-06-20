import { Sequelize } from 'sequelize-typescript';

export default class DB {
    private static clientSequelize: Sequelize;
    private static databaseName: string = 'marketplace_db';
    private static databaseUser: string = 'root';
    private static databasePassword: string = 'password';

    public static get client(): Sequelize {
        if (!this.clientSequelize) {
            this.clientSequelize = new Sequelize(this.databaseName, this.databaseUser, this.databasePassword, {
                dialect: 'mysql',
                models: [ __dirname + '/models' ]
            });
        }

        return this.clientSequelize;        
    } 
}