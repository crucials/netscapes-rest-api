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
import collectionsService from '../services/collections-service.js';
class CollectionsController {
    createCollection(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = request.headers['account-id'];
            if (!accountId) {
                return response.status(500).send('Couldn\'t get account id. Try again later');
            }
            try {
                yield collectionsService.addCollection(request.body, +accountId);
                response.send('Collection created successfully');
            }
            catch (error) {
                response.status(500).send('Failed to create collection');
            }
        });
    }
    deleteCollection(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = request.headers['account-id'];
            if (!accountId) {
                return response.status(500).send('Couldn\'t get account id. Try again later');
            }
            try {
                yield collectionsService.deleteCollection(+request.params.id, +accountId);
                response.send('Collection deleted successfully');
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Failed to delete collection');
                }
            }
        });
    }
    getCollectionsOfAccount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = +request.params.accountId;
            try {
                response.json(yield collectionsService.getCollectionOfAccount(accountId));
            }
            catch (error) {
                response.status(500).send('Failed to get collections');
            }
        });
    }
    getCollectionById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                response.json(yield collectionsService.getCollectionById(+request.params.id));
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Failed to get collection');
                }
            }
        });
    }
    addImageToCollection(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const pictureId = request.query['picture_id'];
            const accountId = request.headers['account-id'];
            if (!pictureId) {
                return response.status(400).send('Query parameter \'picture_id\' must be provided');
            }
            if (!accountId) {
                return response.status(500).send('Couldn\'t get account id. Try again later');
            }
            try {
                yield collectionsService.addPictureToCollection(+request.params.id, +pictureId, +accountId);
                response.send('Added picture to collection successfully');
            }
            catch (error) {
                if (error instanceof StatusCodeError) {
                    response.status(error.statusCode).send(error.message);
                }
                else {
                    response.status(500).send('Failed to add picture to collection');
                }
            }
        });
    }
}
export default new CollectionsController();
//# sourceMappingURL=collections-controller.js.map