import sendRes from '../../../libs/send-res-with-module-map';
import { pool } from '../../../utils/db';

export default async (req, res) => {
    if (req.method === 'GET') {
        console.time('get all items from db');
        const search = req.query && req.query.q;

        // if (search) {
        //     results = await pool.execute(
        //         `select * from notes where title like ? order by id desc`,
        //         ['%' + search + '%']
        //     );
        // } else {
        const results = await fetch(
            'http://0.0.0.0:3001/api/data/absolute_coral_skink'
        );

        // }
        const resJson = await results.json();

        console.timeEnd('get all items from db');
        return res.json(resJson);
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
