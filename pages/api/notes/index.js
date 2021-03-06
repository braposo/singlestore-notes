import sendRes from '../../../libs/send-res-with-module-map';
import { pool } from '../../../utils/db';

export default async (req, res) => {
    if (req.method === 'GET') {
        console.time('get all items from db');
        const search = req.query && req.query.q;
        let results = [];

        if (search) {
            results = await pool.execute(
                `select * from notes where title like ? order by id desc`,
                ['%' + search + '%']
            );
        } else {
            results = await pool.execute(
                'select * from notes order by id desc'
            );
        }

        console.timeEnd('get all items from db');
        return res.json(results[0]);
    }

    if (req.method === 'POST') {
        console.time('create item from db');

        const now = new Date();
        const [
            result,
        ] = await pool.execute(
            'insert into notes (title, body, created_at, updated_at) values (?, ?, ?, ?)',
            [req.body.title, req.body.body, now, now]
        );

        const insertedId = result.insertId;
        console.timeEnd('create item from db');

        return sendRes(req, res, insertedId);
    }

    return res.send('Method not allowed.');
};
