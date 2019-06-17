import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface IConfig {
  port: number;
  apiUrl: string;
  nodeEnv: string;
  clientUrl: string;
  databaseUrl: string;
  spotifyClientId: string;
  spotifyClientSecret: string;
  jwtSecret: string;
}

const config: IConfig = {
  port: +process.env.PORT || 3000,
  apiUrl: process.env.API_URL || "",
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL || "",
  databaseUrl: process.env.DATABASE_URL || "",
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID || "",
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || ""
};

export { config };
