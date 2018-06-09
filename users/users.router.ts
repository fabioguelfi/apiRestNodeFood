import { User } from "./users.model";
import * as restify from "restify";
import { Router } from "../common/router";
import { NotFoundError } from "restify-errors";

class UsersRouter extends Router {
    applyRoutes(application: restify.Server) {
        application.get("/users", (req, resp, next) => {
            User.find()
                .then(users => {
                    resp.json(users);
                    return next();
                })
                .catch(next);
        });

        application.get("/users/:id", (req, resp, next) => {
            User.findById(req.params.id)
                .then(user => {
                    if (user) {
                        resp.json(user);
                        return next();
                    }
                    resp.send(404);
                    return next();
                })
                .catch(next);
        });

        application.post("/users", (req, resp, next) => {
            let user: User = new User(req.body);
            user
                .save()
                .then(user => {
                    user.password = undefined;
                    resp.json(user);
                    return next();
                })
                .catch(next);
        });

        application.put("users/:id", (req, resp, next) => {
            const options = { overwrite: true };
            User.update({ _id: req.params.id }, req.body, options)
                .exec()
                .then(result => {
                    if (result.n) {
                        return User.findById(req.params.id);
                    } else {
                        throw new NotFoundError('Documento nao encontrado')
                    }
                })
                .then(user => {
                    resp.json(user);
                    return next();
                })
                .catch(next);
        });

        application.patch("users/:id", (req, resp, next) => {
            const options = { new: true };
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(user => {
                    if (user) {
                        resp.json(user);
                        return next();
                    }
                    resp.send(404);
                    return next();
                })
                .catch(next);
        });

        application.del("users/:id", (req, resp, next) => {
            User.remove({ _id: req.params.id }).exec()
                .then(
                    (cmdResult: any) => {
                        if (cmdResult.result.n) {
                            resp.send(204);
                        } else {
                            throw new NotFoundError('Documento nao encontrado')
                        }
                        return next();
                    })
                .catch(next);
        });
    }
}

export const usersRouter = new UsersRouter();
