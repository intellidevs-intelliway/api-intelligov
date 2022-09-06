import 'dotenv/config'
import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import helmet from 'helmet';
import './database.js';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json' assert { type: 'json' };

class App {

    constructor(){
        this.server = express();     
        this.middleware();
        this.swagger()
        this.routes();
    }

    middleware(){
        this.server.use(helmet());
        this.server.use(cors());        
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));
    }

    routes(){
        this.server.use(routes);
    }

    swagger(){
        this.server.use('/documentation',swaggerUi.serve, swaggerUi.setup(swaggerFile));
    }
}

export default new App().server;