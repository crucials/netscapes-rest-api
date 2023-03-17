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
import { shuffle } from '../utils.js';
class PicturesService {
    addPicture(picture, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient.picture.create({
                data: Object.assign(Object.assign({}, picture), { authorId }),
            });
        });
    }
    generateFeed(accountId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const lastViewedTags = (_a = (yield prismaClient.account.findFirst({
                where: { id: accountId }
            }))) === null || _a === void 0 ? void 0 : _a.lastViewedTags;
            if (lastViewedTags) {
                const recommendedPictures = yield prismaClient.picture.findMany({
                    where: {
                        tags: {
                            hasSome: lastViewedTags
                        }
                    }
                });
                const remainingPictures = yield prismaClient.picture.findMany({
                    where: {
                        NOT: {
                            tags: {
                                hasSome: lastViewedTags
                            }
                        }
                    }
                });
                return shuffle(recommendedPictures).concat(shuffle(remainingPictures));
            }
            else {
                return yield this.getShuffledPictures();
            }
        });
    }
    getPicture(id, accountId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const foundPicture = yield prismaClient.picture.findFirst({
                where: { id },
                include: { comments: true }
            });
            if (!foundPicture) {
                throw new StatusCodeError(`Picture with id '${id}' not found`, 404);
            }
            if (accountId) {
                const lastViewedTags = (_a = (yield prismaClient.account.findFirst({
                    where: { id: accountId }
                }))) === null || _a === void 0 ? void 0 : _a.lastViewedTags;
                if (lastViewedTags) {
                    if (lastViewedTags.length > 3) {
                        lastViewedTags.pop();
                        yield prismaClient.account.update({
                            where: { id: accountId },
                            data: {
                                lastViewedTags
                            }
                        });
                    }
                    if (lastViewedTags.includes(foundPicture.tags[0])) {
                        yield prismaClient.account.update({
                            where: { id: accountId },
                            data: {
                                lastViewedTags: lastViewedTags.filter(tag => tag !== foundPicture.tags[0])
                            }
                        });
                    }
                    yield prismaClient.account.update({
                        where: { id: accountId },
                        data: {
                            lastViewedTags: {
                                push: foundPicture.tags[0]
                            }
                        }
                    });
                }
            }
            return foundPicture;
        });
    }
    getShuffledPictures() {
        return __awaiter(this, void 0, void 0, function* () {
            return shuffle(yield prismaClient.picture.findMany());
        });
    }
    deletePicture(pictureId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pictureToDelete = yield prismaClient.picture.findFirst({
                where: { id: pictureId }
            });
            if (!pictureToDelete) {
                throw new StatusCodeError(`Picture with id '${pictureId}' not found`, 404);
            }
            if (pictureToDelete.authorId !== accountId) {
                throw new StatusCodeError('You cannot delete this picture', 403);
            }
            yield prismaClient.picture.delete({
                where: { id: pictureToDelete.id }
            });
        });
    }
    getComments(pictureId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPicture = yield prismaClient.picture.findFirst({
                where: { id: pictureId },
                include: {
                    comments: true
                }
            });
            if (!foundPicture) {
                throw new StatusCodeError(`Picture with id '${pictureId}' not found`, 404);
            }
            return foundPicture.comments;
        });
    }
    addComment(pictureId, comment, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPicture = yield prismaClient.picture.findFirst({
                where: { id: pictureId },
                include: {
                    comments: true
                }
            });
            if (!foundPicture) {
                throw new StatusCodeError(`Picture with id '${pictureId}' not found`, 404);
            }
            const foundUser = yield prismaClient.account.findFirst({ where: { id: accountId } });
            if (!foundUser) {
                throw new StatusCodeError(`Account with id '${accountId}' not found`, 404);
            }
            comment.authorUsername = foundUser.username;
            yield prismaClient.picture.update({
                where: { id: foundPicture.id },
                data: {
                    comments: { create: comment }
                }
            });
        });
    }
}
export default new PicturesService();
//# sourceMappingURL=pictures-service.js.map