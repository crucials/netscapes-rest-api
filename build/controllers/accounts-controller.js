var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import StatusCodeError from '../errors/status-code-error.js';
import accountsService from '../services/accounts-service.js';
class AccountsController {
    getCurrentAccount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = request.headers['account-id'];
            if (!accountId) {
                return response.status(500).send('Couldn\'t get account id. Try again later');
            }
            try {
                // Omitting password property from account object with destructuring syntax
                const _a = yield accountsService.getAccountById(+accountId), { password } = _a, accountDTO = __rest(_a, ["password"]);
                response.json(accountDTO);
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Failed to get current account info');
                }
            }
        });
    }
    setAvatar(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatarUrl = request.query['avatar_url'];
            const accountId = request.headers['account-id'];
            if (!accountId) {
                return response.status(500).send('Couldn\'t get account id. Try again later');
            }
            if (!avatarUrl) {
                return response.status(400).send('Query parameter \'avatar_url\' must be provided');
            }
            try {
                yield accountsService.setAvatarUrl(+accountId, avatarUrl);
                response.send('Set the avatar successfully');
            }
            catch (error) {
                response.status(500).send('Failed to set the avatar');
            }
        });
    }
}
export default new AccountsController();
//# sourceMappingURL=accounts-controller.js.map