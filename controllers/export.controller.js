import db from "../config/db.config.js";

const logMemoryUsage = (label) => {
  const memoryUsage = process.memoryUsage();
  console.log(`[${label}] Memory Usage:`, {
    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    arrayBuffers: `${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`,
  });

  console.log('memory usage : ', memoryUsage);
};


const getExportData = async (req, res) => {
  try {
    const { rows, fields } = await db("select * from cosmo_table3");

    res.json({
      msg: "data get successfully ",
      result: {
        rows,
      },
    });
    logMemoryUsage(getExportData);
  } catch (error) {
    console.log("something went wrong in get export data controller : ", error);
  }
};
const getAverageData = async (req, res) => {
  try {
    let { rows, fields } = await db(
      `SELECT
    foreign_country,
    AVG(total_inr_ammount / quantity) AS average_price,
    AVG(quantity) AS average_quantity,
    COUNT(DISTINCT consignee_name) AS consignee_count
FROM
    cosmoDB.cosmo_table3
GROUP BY
    foreign_country `
    );
    const { rows: row, fields: field } = await db(
      `SELECT
    AVG(total_inr_ammount / quantity) AS average_price,
    AVG(quantity) AS average_quantity,
    COUNT(DISTINCT consignee_name) AS consignee_count
FROM
    cosmoDB.cosmo_table3
 `
    );
    row[0]['foreign_country'] = 'All'
    await rows.unshift(row[0]);
    // console.log('row 0th element: ', rows);
    
    res.json({
      msg: "data get successfully ",
      result: {
        rows,
      },
    });
    logMemoryUsage(getAverageData);
  } catch (error) {
    console.log(
      "something went wrong in get average data controller : ",
      error
    );
  }
};

export { getExportData, getAverageData };
