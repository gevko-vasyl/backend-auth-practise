const ApiError = require("../exceptions/api-error");
const TokenService = require("../services/token-service");

module.exports = function (req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return next(ApiError.UnathorizedError());
		}
		const accessToken = authHeader.split(" ")[1];
		if (!accessToken) {
			return next(ApiError.UnathorizedError());
		}
		const userData = TokenService.validateAccessToken(accessToken);
		if (!userData) {
			return next(ApiError.UnathorizedError());
		}

		res.user = userData;
		next();
	} catch (error) {
		return next(ApiError.UnathorizedError());
	}
};
