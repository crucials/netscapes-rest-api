var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import StatusCodeError from '../errors/status-code-error.js';
import prismaClient from '../prisma-client.js';
class AccountsService {
    getAccountById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundAccount = yield prismaClient.account.findFirst({
                where: { id },
                include: {
                    collections: true,
                    publishedPictures: true
                }
            });
            if (!foundAccount) {
                throw new StatusCodeError(`Account with id '${id}' not found`, 404);
            }
            return foundAccount;
        });
    }
    setAvatarUrl(accountId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient.account.update({
                where: { id: accountId },
                data: {
                    avatarUrl: url
                }
            });
        });
    }
}
export default new AccountsService();
//# sourceMappingURL=accounts-service.js.map