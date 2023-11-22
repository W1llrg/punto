import mysql, { type ConnectionOptions } from 'mysql2';

export function useDatabase() {
    const access: ConnectionOptions = {
        user: 'puntoadmin',
        password: '0xOaft2uX6qsxdHh9XF5DRbmxRUve17x0ca6KSCxfIsaEulg',
        database: 'punto',
    };
    
    const conn = mysql.createConnection(access);
    
    conn.query('SELECT 1 + 1 AS `test`;', (_err, rows) => {
        /**
         * @rows: [ { test: 2 } ]
         */
        console.log(rows);
    });
}
