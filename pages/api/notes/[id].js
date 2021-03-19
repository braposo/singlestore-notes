import sendRes from '../../../libs/send-res-with-module-map';

const s2zEndpoint = process.env.SINGLESTORE_ZERO_ENDPOINT;
const s2zSheet = process.env.SINGLESTORE_ZERO_SHEET;

export default async (req, res) => {
    if (req.method === 'GET') {
        console.time('get item from db');

        const results = await fetch(
            `${s2zEndpoint}/${s2zSheet}/${req.query.id}`
        );

        const resJson = await results.json();
        console.timeEnd('get item from db');

        return res.json(resJson);
    }

    if (req.method === 'DELETE') {
        console.time('delete item from db');
        await fetch(`${s2zEndpoint}/${s2zSheet}/${req.query.id}`, {
            method: 'DELETE',
        });
        console.timeEnd('delete item from db');

        return sendRes(req, res, null);
    }

    if (req.method === 'PUT') {
        console.time('update item from db');
        const now = new Date();
        await fetch(`${s2zEndpoint}/${s2zSheet}/${req.query.id}`, {
            body: JSON.stringify({
                ...req.body,
                updated_at: now,
            }),
            method: 'PUT',
        });
        console.timeEnd('update item from db');

        return sendRes(req, res, null);
    }

    return res.send('Method not allowed.');
};
