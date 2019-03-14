"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const request = require("request-promise");
const querystring = require("query-string");
const jsonwebtoken = require("jsonwebtoken");
const constants_1 = require("../constants");
const RANDOM_STRING_LENGTH = 10;
const SPOTIFY_STATE_KEY = "spotskc";
const SPOTIFY_PERMISSIONS_SCOPE = "user-read-private user-read-email playlist-read-private playlist-read-collaborative";
class AuthController {
    static async login(ctx) {
        const state = generateRandomString();
        ctx.cookies.set(SPOTIFY_STATE_KEY, state);
        ctx.redirect(prepareSpotifyAuthorizeUrl(state));
    }
    static async callback(ctx) {
        const code = ctx.query.code || undefined;
        const state = ctx.query.state || undefined;
        const storedState = ctx.cookies.get(SPOTIFY_STATE_KEY);
        if (state === null || state !== storedState) {
            ctx.throw(400, "State error");
        }
        else {
            // clear cookie
            ctx.cookies.set(SPOTIFY_STATE_KEY, undefined);
            const spotifyAcessTokenData = await request(prepareAuthCodeRequestParams(code));
            if (!spotifyAcessTokenData) {
                ctx.throw(400, "Spotify error");
            }
            const token = jsonwebtoken.sign({ data: spotifyAcessTokenData }, config_1.config.jwtSecret, { expiresIn: "50m" });
            ctx.redirect(`${config_1.config.clientUrl}?auth_token=${token}`);
        }
    }
}
exports.default = AuthController;
const prepareSpotifyAuthorizeUrl = (state) => {
    const qs = querystring.stringify({
        response_type: "code",
        client_id: config_1.config.spotifyClientId,
        scope: SPOTIFY_PERMISSIONS_SCOPE,
        redirect_uri: `${config_1.config.apiUrl}/callback`,
        state
    });
    return `${constants_1.SPOTIFY_ACCOUNTS_BASE_URL}/authorize?${qs}`;
};
const prepareAuthCodeRequestParams = (code) => ({
    method: "POST",
    uri: `${constants_1.SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
    form: {
        code,
        redirect_uri: `${config_1.config.apiUrl}/callback`,
        grant_type: "authorization_code"
    },
    headers: {
        Authorization: "Basic " +
            new Buffer(config_1.config.spotifyClientId + ":" + config_1.config.spotifyClientSecret).toString("base64")
    },
    json: true
});
const generateRandomString = (length = RANDOM_STRING_LENGTH) => {
    let text = "";
    const variations = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += variations.charAt(Math.floor(Math.random() * variations.length));
    }
    return text;
};
//# sourceMappingURL=auth.js.map