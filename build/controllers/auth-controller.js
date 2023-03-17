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
import authService from '../services/auth-service.js';
import { validationResult } from 'express-validator';
class AuthController {
    logIn(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = request.body;
            try {
                response.send(yield authService.logIn(username, password));
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Failed to log you in. Try again later');
                }
            }
        });
    }
    signUp(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationErrors = validationResult(request);
            if (!validationErrors.isEmpty()) {
                return response.status(400).send(validationErrors.array()[0].msg);
            }
            const { username, password } = request.body;
            try {
                yield authService.signUp(username, password);
                response.send('Successfully created new account');
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Failed to create new account. Try again later');
                }
            }
        });
    }
}
export default new AuthController();
//# sourceMappingURL=auth-controller.js.map