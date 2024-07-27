import app from "./app";
import ServerlessHttp from "serverless-http";

export const handler = ServerlessHttp(app);
