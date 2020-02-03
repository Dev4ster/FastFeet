import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientDetailsController from './app/controllers/RecipientDetailsController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';
import permissonMiddleware from './app/middlewares/permission';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.use(permissonMiddleware);
routes.post('/recipient', RecipientController.store);

// details
routes.get('/recipient/details', RecipientDetailsController.index);
routes.post('/recipient/details', RecipientDetailsController.store);
routes.put('/recipient/details/:id', RecipientDetailsController.update);
routes.delete('/recipient/details/:id', RecipientDetailsController.delete);
export default routes;
