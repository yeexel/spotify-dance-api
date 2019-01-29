import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface IConfig {
  port: number;
  spotifyClientId: string;
  spotifyClientSecret: string;
  jwtSecret: string;
}

const config: IConfig = {
  port: +process.env.PORT || 3000,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID || "",
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || ""
};

export { config };
