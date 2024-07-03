import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import router from "../routes/routes.js";
import { initialiseRedisClient, isRedisWorking } from "../middleware/redis.js";

export default class Server {
  #app;
  #host;
  #port;
  #router;
  #server;

  constructor(port, host, router) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#server = null;
    this.#router = router;
  }

  getApp = () => {
    return this.#app;
  };

  start = async () => {
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server is listening on http://${this.#host}:${this.#port}`);
    });

    this.#app.use(cors());
    this.#app.use(morgan(`tiny`));
    this.#app.use(bodyParser.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.json());

    await initialiseRedisClient();
    isRedisWorking();

    this.#app.use(`/api`, router);
  };

  close = () => {
    this.#server?.close();
  };
}
