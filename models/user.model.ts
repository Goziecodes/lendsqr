
import { Model } from 'objection';
import { getConnection } from '../database';
Model.knex(getConnection())

export interface User {
    readonly id: number;
    readonly email: string;
    readonly fullname: string;
    readonly password: string;
}

export class UserModel extends Model {
  static get tableName() {
    return 'lendsqr_users';
  }

  static async createUser(userDetails: Partial<User>) {
    return this.query().insert(userDetails)
  }
}
