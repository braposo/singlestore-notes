import sendRes from '../../../libs/send-res-with-module-map';
import { pool } from '../../../utils/db';

export default async (req, res) => {
    if (req.method === 'GET') {
        console.time('get item from db');
        // const [rows] = await pool.execute('select * from notes where id = ?', [
        //     req.query.id,
        // ]);
        const results = await fetch(
            `http://0.0.0.0:3001/api/data/absolute_coral_skink/${req.query.id}`
        );

        const resJson = await results.json();
        console.log(resJson);
        console.timeEnd('get item from db');

        return res.json(resJson);
    }

    if (req.method === 'DELETE') {
        console.time('delete item from db');
        await pool.execute('delete from notes where id = ?', [req.query.id]);
        console.timeEnd('delete item from db');

        return sendRes(req, res, null);
    }

    if (req.method === 'PUT') {
        console.time('update item from db');
        const now = new Date();
        // const updatedId = Number(req.query.id);
        // await pool.execute(
        //     'update notes set title = ?, body = ?, updated_at = ? where id = ?',
        //     [req.body.title, req.body.body, now, updatedId]
        // );

        await fetch(
            `http://0.0.0.0:3001/api/data/absolute_coral_skink/${req.query.id}`,
            {
                body: JSON.stringify({
                    ...req.body,
                    updatedAt: now,
                }),
                method: 'PUT',
            }
        );
        console.timeEnd('update item from db');

        return sendRes(req, res, null);
    }

    return res.send('Method not allowed.');
};
