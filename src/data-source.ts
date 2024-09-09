import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: 3306,
  username: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: true,
  entities: [__dirname + "/entity/*.ts", __dirname + "/entity/*.js"],
  migrations: [__dirname + "/migrations/*.ts", __dirname + " /migrations/*.js"],
});
