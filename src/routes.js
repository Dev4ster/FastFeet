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

// details
routes.get('/recipients/details/:id', RecipientDetailsController.show);
routes.get('/recipients/details', RecipientDetailsController.index);
routes.post('/recipients/details', RecipientDetailsController.store);
routes.put('/recipients/details/:id', RecipientDetailsController.update);
routes.delete('/recipients/details/:id', RecipientDetailsController.delete);

// RECIPIENT
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);
routes.get('/recipients/:id', RecipientController.show);
export default routes;
