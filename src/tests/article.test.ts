import { getArticle } from '../utils/article';

describe('testGetArticle', () => {
    const alertMock = jest.fn();
    global.window.alert = alertMock;

    test('invalid articleId', async () => {
        await getArticle(100, 'en');
        expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('articleId not exist'));
    });

    test('valid articleId', async () => {
        let article = await getArticle(1, 'en');
        let expectedArticle = {
            title: 'bitcoin',
            content: expect.stringContaining('Bitcoin (BTC) is the first decentralized cryptocurrency'),
        };
        expect(article).toEqual(expectedArticle);
    });
});
