import sendRes from '../../../libs/send-res-with-module-map';

const s2zEndpoint = process.env.SINGLESTORE_ZERO_ENDPOINT;
const s2zSheet = process.env.SINGLESTORE_ZERO_SHEET;

export default async (req, res) => {
    if (req.method === 'GET') {
        console.time('get all items from db');
        const search = req.query && req.query.q;

        const results = search
            ? await fetch(
                  `${s2zEndpoint}/${s2zSheet}/search?field=title&query=${search}`
              )
            : await fetch(`${s2zEndpoint}/${s2zSheet}`);

        const resJson = await results.json();

        console.timeEnd('get all items from db');
        return res.json(resJson);
    }

    if (req.method === 'POST') {
        console.time('create item from db');

        const now = new Date();

        const result = await fetch(`${s2zEndpoint}/${s2zSheet}`, {
            body: JSON.stringify({
                ...req.body,
                updated_at: now,
                created_at: now,
            }),
            method: 'POST',
        });

        const insertedId = result.insertId;
        console.timeEnd('create item from db');

        return sendRes(req, res, insertedId);
    }

    return res.send('Method not allowed.');
};
