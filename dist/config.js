"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const config = {
    port: +process.env.PORT || 3000,
    apiUrl: process.env.API_URL || "",
    clientUrl: process.env.CLIENT_URL || "",
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID || "",
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
    jwtSecret: process.env.JWT_SECRET || ""
};
exports.config = config;
//# sourceMappingURL=config.js.map