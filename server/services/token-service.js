const jwt = require("jsonwebtoken");
const TokenModel = require("../models/token-model");

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "10s" });
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "20s" });
		return {
			accessToken,
			refreshToken,
		};
	}

	validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
			return userData;
		} catch (error) {
			return null;
		}
	}

	validateRefreshToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
			return userData;
		} catch (error) {
			return null;
		}
	}

	async saveToken(userId, refreshToken) {
		const userToken = await TokenModel.findOne({ user: userId });
		if (userToken) {
			userToken.refreshToken = refreshToken;
			return userToken.save();
		}
		const token = await TokenModel.create({ user: userId, refreshToken });
		return token;
	}

	async removeToken(refreshToken) {
		const tokenData = await TokenModel.deleteOne({ refreshToken });
		return tokenData;
	}

	async findToken(refreshToken) {
		const token = await TokenModel.findOne({ refreshToken });
		return token;
	}
}

module.exports = new TokenService();
