"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const constants_1 = require("../constants");
const typeorm_1 = require("typeorm");
const user_1 = require("../entity/user");
class SpotifyController {
    static async account(ctx) {
        const accountData = await request(requestSpotifyApi("me", ctx.state.user.access_token));
        console.log("db");
        const userRepository = typeorm_1.getManager().getRepository(user_1.User);
        const users = await userRepository.find();
        console.log(users);
        accountData.users = users;
        ctx.body = accountData;
    }
}
exports.SpotifyController = SpotifyController;
const requestSpotifyApi = (endpoint, token) => ({
    method: "GET",
    uri: `${constants_1.SPOTIFY_API_BASE_URL}/${endpoint}`,
    headers: {
        Authorization: `Bearer ${token}`
    },
    json: true
});
exports.requestSpotifyApi = requestSpotifyApi;
//# sourceMappingURL=spotify.js.map