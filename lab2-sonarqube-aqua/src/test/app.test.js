const request = require('supertest');
const server =  require('../app');
describe('Get Endpoints', () => {
    it('Get', async (done) => {
        const res =  await  request(server)
        .get('/')
        .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        done();
    })
})
afterAll(async  done  => {
    server.close();
    done();
});
