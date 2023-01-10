import { IUser } from "../User";

export interface IAuthResponse {
	accessToken: string;
	refreshToken: string;
	user: IUser;
}
