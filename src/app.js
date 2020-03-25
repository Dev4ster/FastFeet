import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import path from 'path';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import Youch from 'youch';
import routes from './routes';
import './database';
import configSentry from './config/sentry';

class App {
  constructor() {
    this.server = express();
    Sentry.init(configSentry);
    this.middleWares();
    this.routes();
    this.exceptionHandler();
  }

  middleWares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const erros = await new Youch(err, req).toJSON();
      return res.status(500).json(erros);
    });
  }
}

export default new App().server;
