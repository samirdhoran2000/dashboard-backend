import mysql from "mysql2/promise";

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// const convertBufferToString = (fields) => {
//   return fields.map((field) => {
//     if (Buffer.isBuffer(field)) {
//       return field.toString("utf8"); // convert buffer to string
//     }
//     return field;
//   });
// };

const db = async (query) => {
    try {
      if (!query) {
        return "provide a query ";
      }
      const conn = await pool.getConnection();
      // For pool initialization, see above
      const [rows, fields] = await conn.query(query);
      // Convert Buffer fields to strings
    //   const convertedFields = convertBufferToString(fields);
      console.log({ rows, fields });
        
      const result = {
        rows,
        fields,
      };
      // Don't forget to release the connection when finished!
      pool.releaseConnection(conn);
      return result;
      // Connection is automatically released when query resolves
    } catch (err) {
    console.log('query is not correct or something went wrong in while query : ',err);
    // Don't forget to release the connection when finished!
        pool.releaseConnection(conn);
        return;
  }

//   conn.release();
};

export default db;