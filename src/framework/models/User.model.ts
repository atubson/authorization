import { Model, Table, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty } from 'sequelize-typescript';

export interface UserI {
    id?: number | null
    name?: string
    email?: string
    password?: string
    privileges?: number
    status?: number
}

@Table({
    tableName: 'tbl_users',
    timestamps: true
})
export default class User extends Model implements UserI {
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number

    @AllowNull(true)
    @Column
    name?: string

    @AllowNull(false)
    @Column
    email?: string

    @AllowNull(false)
    @Column
    password?: string

    @AllowNull(false)
    @Column
    privileges?: number

    @AllowNull(false)
    @Column
    status?: number

}