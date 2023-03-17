var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import StatusCodeError from '../errors/status-code-error.js';
import prismaClient from '../prisma-client.js';
class AuthService {
    logIn(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield prismaClient.account.findFirst({
                where: {
                    username
                }
            });
            if (!foundUser) {
                throw new StatusCodeError(`Invalid username or password`, 401);
            }
            if (bcrypt.compareSync(password, foundUser.password)) {
                return this.generateJwt(foundUser.id);
            }
            else {
                throw new StatusCodeError('Invalid username or password', 401);
            }
        });
    }
    signUp(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield prismaClient.account.findFirst({
                where: { username }
            });
            if (foundUser) {
                throw new StatusCodeError(`Account with username '${username}' already exists`, 409);
            }
            const hashedPassword = bcrypt.hashSync(password);
            yield prismaClient.account.create({
                data: {
                    username,
                    password: hashedPassword
                }
            });
        });
    }
    generateJwt(accountId) {
        return jwt.sign({ accountId }, process.env.JWT_SECRET_KEY, { expiresIn: '90d' });
    }
}
export default new AuthService();
//# sourceMappingURL=auth-service.js.map