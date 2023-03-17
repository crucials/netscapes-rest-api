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
import picturesService from './pictures-service.js';
class CollectionsService {
    addCollection(collection, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient.collection.create({
                data: Object.assign(Object.assign({}, collection), { authorId })
            });
        });
    }
    deleteCollection(collectionId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionToDelete = yield prismaClient.collection.findFirst({
                where: { id: collectionId }
            });
            if (!collectionToDelete) {
                throw new StatusCodeError(`Collection with id '${collectionId}' not found`, 404);
            }
            if (collectionToDelete.authorId !== accountId) {
                throw new StatusCodeError('You cannot delete this collection', 403);
            }
            yield prismaClient.collection.delete({
                where: { id: collectionToDelete.id }
            });
        });
    }
    getCollectionOfAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient.collection.findMany({
                where: {
                    author: {
                        id: accountId
                    }
                },
                include: { savedPictures: true }
            });
        });
    }
    getCollectionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundCollection = yield prismaClient.collection.findFirst({
                where: { id },
                include: { savedPictures: true }
            });
            if (!foundCollection) {
                throw new StatusCodeError(`Collection with id '${id}' not found`, 404);
            }
            return foundCollection;
        });
    }
    addPictureToCollection(collectionId, pictureId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundCollection = yield prismaClient.collection.findFirst({
                where: { id: collectionId },
                include: { savedPictures: true }
            });
            const foundPicture = yield picturesService.getPicture(pictureId);
            if (!foundCollection) {
                throw new StatusCodeError(`Collection with id '${collectionId}' not found`, 404);
            }
            if (foundCollection.authorId !== accountId) {
                throw new StatusCodeError('You cannot update this collection', 403);
            }
            yield prismaClient.collection.update({
                where: { id: foundCollection.id },
                data: {
                    savedPictures: {
                        connect: {
                            id: foundPicture.id
                        }
                    }
                }
            });
        });
    }
}
export default new CollectionsService();
//# sourceMappingURL=collections-service.js.map