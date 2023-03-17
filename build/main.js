import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './router/auth-router.js';
import picturesRouter from './router/pictures-router.js';
import collectionsRouter from './router/collections-router.js';
import accountsRouter from './router/accounts-router.js';
import prismaClient from './prisma-client.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/pictures', picturesRouter);
app.use('/collections', collectionsRouter);
app.use('/accounts', accountsRouter);
app.listen(5000, () => {
    console.log('Server started');
    prismaClient.account.findMany().then(accounts => {
        console.log(accounts);
    });
});
//# sourceMappingURL=main.js.map