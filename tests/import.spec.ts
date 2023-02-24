import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import { startServer } from '../src/server';

chai.use(chaiHttp);
const { expect } = chai;
const should = chai.should();
const app = startServer();
describe('Import endpoints', () => {
    describe('Consent import', () => {
        it('Should invalidate the request if the signedConsent or serviceExportUrl is missing', (done) => {
            chai.request(app)
                .post('/consent/import')
                .send({})
                .end((err, res) => {
                    expect(res.status).to.eq(400);
                    done();
                });
        });

        it('Should respond with a 200 status code', (done) => {
            const payload = {
                signedConsent: 'abc',
                serviceExportUrl: 'http://example.com',
            };
            chai.request(app)
                .post('/consent/import')
                .send(payload)
                .end((err, res) => {
                    expect(res.status).to.eq(200);
                    done();
                });
        });
    });

    describe('Data import', () => {
        it('Should invalidate the request if the params are missing', (done) => {
            chai.request(app)
                .post('/data/import')
                .send({ user: '123', data: {} })
                .end((err, res) => {
                    expect(res.status).to.eq(400);
                    expect(res.body).to.have.property('errors');
                    done();
                });
        });

        it('Should respond with OK', (done) => {
            chai.request(app)
                .post('/data/import')
                .send({ user: '123', data: {}, signedConsent: 'abc' })
                .end((err, res) => {
                    expect(res.status).to.eq(200);
                    done();
                });
        });
    });
});
