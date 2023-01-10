import { AxiosResponse } from "axios";
import { IAuthResponse } from "../models/response/AuthResponse";
import $api from "../http";

export default class AuthService {
	static async login(email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
		return $api.post<IAuthResponse>("/login", { email, password });
	}

	static async registration(
		email: string,
		password: string
	): Promise<AxiosResponse<IAuthResponse>> {
		return $api.post("/registration", { email, password });
	}

	static async logout(): Promise<void> {
		return $api.post("/logout");
	}
}
