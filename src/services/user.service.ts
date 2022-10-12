import {User, UserModel} from '../models/user.model';


export default class AuthService {
	static  getUsers(offset: number, limit: number) {
        return UserModel.getUsers(offset, limit)
	}
};