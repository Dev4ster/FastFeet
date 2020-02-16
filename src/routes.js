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
import OrdersController from './app/controllers/OrdersController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Deliveryman viewer
routes.get('/deliveryman/:id/deliveries', DeliveryController.index);
routes.put('/deliveryman/:id/deliveries/:id_order', DeliveryController.update);

// Deliveryman viewer problems
routes.post('/delivery/:id/problems', DeliveryProblemsController.store);
routes.get('/delivery/:id/problems', DeliveryProblemsController.show);

// IS ADMIN MIDDLEWARE
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

// Orders
routes.get('/orders', OrdersController.index);
routes.post('/orders', OrdersController.store);
routes.put('/orders/:id', OrdersController.update);
routes.delete('/orders/:id', OrdersController.delete);

// Problems viewer

routes.get('/delivery/problems', DeliveryProblemsController.index);
routes.put('/problems/:id/cancel-delivery', DeliveryProblemsController.update);

export default routes;
