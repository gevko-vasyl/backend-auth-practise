import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import { IUser } from "../models/User";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";

export default class Store {
	user = {} as IUser;
	isAuth = false;
	isLoading = false;
	allUsers = [] as IUser[];

	constructor() {
		makeAutoObservable(this);
	}

	setAuth(isAuth: boolean) {
		this.isAuth = isAuth;
	}

	setUser(user: IUser) {
		this.user = user;
	}

	setLoading(isLoading: boolean) {
		this.isLoading = isLoading;
	}

	setAllUsers(users: IUser[]) {
		this.allUsers = [...users];
	}

	async login(email: string, password: string) {
		try {
			const response = await AuthService.login(email, password);
			localStorage.setItem("token", response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (error: any) {
			console.log(error.response?.data?.message);
		}
	}

	async registration(email: string, password: string) {
		try {
			const response = await AuthService.registration(email, password);
			console.log("response", response);

			localStorage.setItem("token", response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (error: any) {
			console.log(error.response?.data?.message);
		}
	}

	async logout() {
		try {
			await AuthService.logout();
			localStorage.removeItem("token");
			this.setAuth(false);
			this.setUser({} as IUser);
		} catch (error: any) {
			console.log(error.response?.data?.message);
		}
	}

	async checkAuth() {
		this.setLoading(true);
		try {
			const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
			localStorage.setItem("token", response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (error: any) {
			console.log(error.response.data.message);
		} finally {
			this.setLoading(false);
		}
	}

	async fetchUsers() {
		this.setLoading(true);
		try {
			const response = await UserService.fetchUsers();
			this.setAllUsers(response.data);
		} catch (error: any) {
			console.log(error.response.data.message);
		} finally {
			this.setLoading(false);
		}
	}
}
