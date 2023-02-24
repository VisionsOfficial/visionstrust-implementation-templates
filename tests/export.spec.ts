import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import { startServer } from '../src/server';

chai.use(chaiHttp);
const { expect } = chai;
const should = chai.should();
const app = startServer();
describe('Export endpoints', () => {
    describe('Consent export', () => {
        it('Should invalidate the request if the signedConsent is missing', (done) => {
            chai.request(app)
                .post('/data/export')
                .send({})
                .end((err, res) => {
                    expect(res.status).to.eq(400);
                    done();
                });
        });

        it('Should generate a <50 char token and return it', (done) => {
            const payload = {
                signedConsent: 'abc',
            };
            chai.request(app)
                .post('/consent/export')
                .send(payload)
                .end((err, res) => {
                    expect(res.body).to.have.keys('message', 'token');
                    res.body.should.have.property('token');
                    res.body.token.length.should.be.lt(50);
                    done();
                });
        });
    });

    describe('Data export', () => {
        it('Should invalidate the request if the signedConsent is missing', (done) => {
            chai.request(app)
                .post('/data/export')
                .send({})
                .end((err, res) => {
                    expect(res.status).to.eq(400);
                    done();
                });
        });

        it('Should respond with OK if the signedConsent is included', (done) => {
            chai.request(app)
                .post('/data/export')
                .send({ signedConsent: 'abc' })
                .end((err, res) => {
                    expect(res.status).to.eq(200);
                    done();
                });
        });
    });
});
