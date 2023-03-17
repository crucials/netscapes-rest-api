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
import picturesService from '../services/pictures-service.js';
class PicturesController {
    createPicture(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = request.headers['account-id'];
            if (!accountId) {
                return response.status(500).send('Couldn\'t get account id. Try again later');
            }
            try {
                yield picturesService.addPicture(request.body, +accountId);
                response.send('Created new picture successfully');
            }
            catch (error) {
                response.status(500).send('Failed to create new picture');
            }
        });
    }
    getPicturesFeed(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = request.headers['account-id'];
            try {
                if (!accountId) {
                    return response.json(yield picturesService.getShuffledPictures());
                }
                response.json(yield picturesService.generateFeed(+accountId));
            }
            catch (error) {
                response.status(500).send('Failed to create pictures feed');
            }
        });
    }
    getPicture(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = Number(request.headers['account-id']);
            try {
                response.json(yield picturesService.getPicture(+request.params.id, accountId));
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Something went wrong while getting picture from server');
                }
            }
        });
    }
    deletePicture(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = request.headers['account-id'];
            if (!accountId) {
                return response.status(500).send('Couldn\'t get account id. Try again later');
            }
            try {
                yield picturesService.deletePicture(+request.params.id, +accountId);
                response.send('Deleted picture successfully');
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Failed to delete picture');
                }
            }
        });
    }
    getPictureComments(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                response.json(yield picturesService.getComments(+request.params.id));
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Failed to get picture comments');
                }
            }
        });
    }
    createComment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = request.headers['account-id'];
            if (!accountId) {
                return response.status(500).send('Couldn\'t get account id. Try again later');
            }
            try {
                yield picturesService.addComment(+request.params.id, request.body, +accountId);
                response.send('Created comment successfully');
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Failed to add comment');
                }
            }
        });
    }
}
export default new PicturesController();
//# sourceMappingURL=pictures-controller.js.map