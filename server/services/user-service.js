const bcrypt = require("bcrypt");
const uuid = require("uuid");
const UserModel = require("../models/user-model");
const MailService = require("./mail-service");
const TokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
	async registration(email, password) {
		const candidate = await UserModel.findOne({ email });
		if (candidate) {
			throw ApiError.BadRequest(`User with email ${email} has been already registered`);
		}
		const hashPassword = await bcrypt.hash(password, 5);
		const activationLink = uuid.v4();
		const user = await UserModel.create({ email, password: hashPassword, activationLink });
		await MailService.sendActivationMail(
			email,
			`${process.env.API_URL}/app/activate/${activationLink}`
		);
		const userDto = new UserDto(user);
		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async login(email, password) {
		const user = await UserModel.findOne({ email });
		if (!user) {
			throw ApiError.BadRequest("Incorrect email");
		}
		const isPassEquals = await bcrypt.compare(password, user.password);
		if (!isPassEquals) {
			throw ApiError.BadRequest("Incorrect password");
		}
		const userDto = new UserDto(user);
		const tokens = TokenService.generateTokens({ ...userDto });

		await TokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async logout(refreshToken) {
		const token = await TokenService.removeToken(refreshToken);
		return token;
	}

	async activate(activationLink) {
		const user = await UserModel.findOne({ activationLink });
		if (!user) {
			throw ApiError.BadRequest("Invalid verification link");
		}
		user.isActivated = true;
		await user.save();
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnathorizedError();
		}

		const userData = TokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await TokenService.findToken(refreshToken);

		if (!userData || !tokenFromDb) {
			throw ApiError.UnathorizedError();
		}

		const user = await UserModel.findById(userData.id);
		const userDto = new UserDto(user);

		const tokens = TokenService.generateTokens({ ...userDto });

		await TokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async getUsers() {
		const users = await UserModel.find();
		return users;
	}
}

module.exports = new UserService();
