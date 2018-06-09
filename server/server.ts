import { enviroment } from './../common/enviroment';
import * as restify from "restify";

export class Server {
    application: restify.Server;

    initRoutes(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: "meat-api",
                    version: "1.0.0"
                });

                this.application.use(restify.plugins.queryParser());

                // routes 
                this.application.get('/info', [(req, resp, next) => {
                    return next()
                }, (req, resp, next) => {
                    resp.json({
                        browser: req.userAgent(),
                        method: req.method,
                        url: req.url,
                        path: req.path(),
                        query: req.query
                    });

                    return next();
                }]);

                this.application.listen(enviroment.server.port, () => {
                    resolve(this.application);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    bootstrap(): Promise<Server> {
        return this.initRoutes().then(() => this);
    }
}
