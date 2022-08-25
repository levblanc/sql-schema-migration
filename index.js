const express = require('express');
const pg = require('pg');

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'socialnetwork',
  user: 'levblancx',
  password: '',
});

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/posts', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT * FROM posts;
  `);

  res.send(`
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>lat</th>
          <th>lng</th>
        </tr>
      </thead> 
      <tbody>
        ${rows
          .map((row) => {
            return `
            <tr>
              <th>${row.id}</th>
              <th>${row.loc.x}</th>
              <th>${row.loc.y}</th>
            </tr>
          `;
          })
          .join('')}
        </tbody>
    </table>
    <form method='POST' >
      <h3>Create Post</h3>
      <div>
        <label>Lng</label>
        <input name='lng'> 
      </div>
      <div>
        <label>Lat</label>
        <input name='lat'> 
      </div>
      <button type='submit'>Create</button>
    </form>
  `);
});

app.post('/posts', async (req, res) => {
  const { lng, lat } = req.body;

  await pool.query('INSERT INTO posts (loc) VALUES ($1);', [
    `(${lng}, ${lat})`,
  ]);

  res.redirect('/posts');
});

app.listen(3005, (res) => {
  console.log('Listening on port 3005!');
});
