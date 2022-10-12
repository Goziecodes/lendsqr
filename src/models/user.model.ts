
import { Model } from 'objection';
import { omit } from 'lodash';
import {encode} from '../utils/jwt'

import { getConnection } from '../database';
import hashPassword from '../utils/hash-password';
Model.knex(getConnection())

export interface User {
    readonly id: string;
    readonly email: string;
    readonly fullname: string;
    readonly password: string;
}

export class UserModel extends Model implements User {
  id!: string;
  email!: string;
  fullname!: string;
  password!: string;

  static get tableName() {
    return 'lendsqr_users';
  }

  static comparePassword(inputPassword: string, password: string) {
    return password === hashPassword(inputPassword);
}

  static async createUser(userDetails: Partial<User>) {
    const emailExists =  await this.query()
    .findOne({email: userDetails.email})

    if(emailExists) {
        return Promise.reject('Email already exists');
    }
    
    const user = await this.query().insert({
        ...userDetails,
        password: hashPassword(userDetails.password as string)
    });
    return omit(user.toJSON(), ['password']);
  }

  static async loginUser(loginDetails: Pick<User, "email" | "password">) {
    const foundUser = await this.query()
    .findOne({email: loginDetails.email})

		if (!foundUser) {
			return Promise.reject('Email or Password incorrect');
		}

		if(!this.comparePassword(loginDetails.password, foundUser.password)) {
			return Promise.reject('Email or Password incorrect');            
		}	

		return  {token: encode({
            id: foundUser.id,
            email: foundUser.email
        })}
  }

  static async getUsers( offset: number, limit: number) {
    return await this.query()
    .select('id', 'fullname')
    .offset(offset || 0)
    .limit(limit || 20)
  }
}
