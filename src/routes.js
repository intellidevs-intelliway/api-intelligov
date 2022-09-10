import { Router } from "express";
import checkCredentials from "./middlewares/checkCredentials.js"
import AuthController from "./controllers/AuthController.js";
import UserController from "./controllers/UserController.js";
import CompanyController from "./controllers/CompanyController.js";
import createUserValidation from "./middlewares/createUserValidation.js";

const routes = new Router();

routes.get('/', async function (req, res) {
   return res.json({ message: "UP" })
});

routes.post('/login',AuthController.store);

//Rota travada
routes.use(checkCredentials);
routes.post('/user/recovery',AuthController.recovery);
routes.get('/user',UserController.list);
routes.post('/user',createUserValidation,UserController.store);
routes.get('/user/:id',UserController.show);
routes.put('/user/:id',UserController.edit);
routes.delete('/user/:id',UserController.delete);

routes.get('/company',CompanyController.list);
routes.post('/company',CompanyController.store);
routes.get('/company/:id',CompanyController.show);
// routes.put('/company/:id',CompanyController.edit);
routes.delete('/company/:id',CompanyController.delete);


export default routes;