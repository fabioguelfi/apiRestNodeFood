import { usersRouter } from './users.router';
import { User } from './users.model';
import { environment } from './../common/environment';
import { Server } from './../server/server';
import 'jest'
import * as request from 'supertest';

let server: Server;
let address: string;
beforeAll((() => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    environment.server.port = process.env.SERVER_PORT || 3001;
    address = `http://localhost:${environment.server.port}`
    server = new Server()
    return server.bootstrap([usersRouter])
        .then(() => User.remove({}).exec())
        .catch(console.error)
}))

afterAll(() => {
    return server.shutdown();
})

test('get /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('post /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario2',
            email: 'usuario2@gmail.com',
            password: 'abc-123456',
            cpf: '437.872.798-65'
        })
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('usuario2');
            expect(response.body.email).toBe('usuario2@gmail.com');
            expect(response.body.cpf).toBe('437.872.798-65')
            expect(response.body.password).toBeUndefined();
        }).catch(fail)
})


