import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientDetailsController from './app/controllers/RecipientDetailsController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';
import permissonMiddleware from './app/middlewares/permission';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.use(permissonMiddleware);

// Details
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

// Files
routes.post('/files', upload.single('file'), FileController.store);
// Deliveryman
routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id?', DeliverymanController.update);
routes.delete('/deliveryman/:id?', DeliverymanController.delete);
export default routes;
