import { handleError } from './error.handler';
import { enviroment } from "./../common/enviroment";
import { Router } from "../common/router";
import * as mongoose from "mongoose";
import * as restify from "restify";
export class Server {
    application: restify.Server;

    initializeDb(): mongoose.MongooseThenable {
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect(enviroment.db.url, {
            useMongoClient: true
        });
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: "meat-api",
                    version: "1.0.0"
                });

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());

                // routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }

                this.application.listen(enviroment.server.port, () => {
                    resolve(this.application);
                });

                this.application.on('restifyError', handleError)

            } catch (error) {
                reject(error);
            }
        });
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() => {
            return this.initRoutes(routers).then(() => this);
        });
    }
}
