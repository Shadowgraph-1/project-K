import fp from 'fastify-plugin';

export default fp(async (app) => {
    app.decorate('authenticate', async function (req, rep) {
        try {
            await req.jwtVerify();
        } catch {
            return rep.status(401).send({ error: 'Требуется авторизация'});
        }
    });
});