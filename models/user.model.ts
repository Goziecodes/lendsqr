
import { Model } from 'objection';
import { database } from '../database';

Model.knex(database)

export class User extends Model {
  static get tableName() {
    return 'lendsqr_users';
  }
}

//  function createUser(userDetails){
//     await User.query.fin
//   }
