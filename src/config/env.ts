import dotenv from "dotenv";

dotenv.config();

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Environment variable ${name} is required but was not provided.`,
    );
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  clientUrl: required(process.env.CLIENT_URL, "CLIENT_URL"),
  isProduction: process.env.NODE_ENV === "production",
  appName: process.env.APP_NAME || "MyApp",
};
