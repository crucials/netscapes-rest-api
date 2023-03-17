import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prismaClient from './prisma-client.js';
import auth from './api/auth.js';
import pictures from './api/pictures.js';
import collections from './api/collections.js';
import accounts from './api/accounts.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/pictures', pictures);
app.use('/collections', collections);
app.use('/accounts', accounts);
app.listen(5000, () => {
    console.log('Server started');
    prismaClient.account.findMany().then(accounts => {
        console.log(accounts);
    });
});
//# sourceMappingURL=main.js.map