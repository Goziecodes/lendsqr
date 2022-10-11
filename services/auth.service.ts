import {User, UserModel} from '../models/user.model';


export default class AuthService {
	static  createUser(userDetails: Partial<User>) {
        return UserModel.createUser(userDetails)
	}
	static  login(loginDetails: Pick<User, "email" | "password">) {
        return UserModel.loginUser(loginDetails)
	}
};