const Pool = require('pg').Pool

const dat = new Pool({
    host: 'postgis',
    database: 'data',
    user: 'postgres',
    password: '1234',
    port: 5432,
});


exports.dat = dat;