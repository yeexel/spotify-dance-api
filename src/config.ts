import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface IConfig {
  port: number;
  apiUrl: string;
  clientUrl: string;
  spotifyClientId: string;
  spotifyClientSecret: string;
  jwtSecret: string;
}

const config: IConfig = {
  port: +process.env.PORT || 3000,
  apiUrl: process.env.API_URL || "",
  clientUrl: process.env.CLIENT_URL || "",
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID || "",
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || ""
};

export { config };
