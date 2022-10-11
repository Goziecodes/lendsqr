
import { Model } from 'objection';
import { omit } from 'lodash';

import { getConnection } from '../database';
import hashPassword from '../utils/hash-password';
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
    const emailExists =  await this.query()
    .findOne({email: userDetails.email})

    if(emailExists) {
        return Promise.reject({ email: 'Email already exists' });
    }
    
    const user = await this.query().insert({
        ...userDetails,
        password: hashPassword(userDetails.password as string)
    });
    return omit(user.toJSON(), ['password']);
  }
}
