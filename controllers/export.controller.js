import db from "../config/db.config.js";

const getExportData = async (req, res) => {
  try {
    const { rows, fields } = await db("select * from cosmo_table1");

    res.json({
      msg: "data get successfully ",
      result: {
        rows,
      },
    });
  } catch (error) {
    console.log("something went wrong in get export data controller : ", error);
  }
};
const getAverageData = async (req, res) => {
  try {   
      const { rows, fields } = await db(
        `SELECT
    foreign_country,
    AVG(total_fob_inr / quantity) AS average_price,
    AVG(quantity) AS average_quantity,
    COUNT(DISTINCT consignee_name) AS consignee_count
FROM
    cosmoDB.cosmo_table1
GROUP BY
    foreign_country `
      );

      res.json({
        msg: "data get successfully ",
        result: {
          rows,
        },
      });
  } catch (error) {
    console.log(
      "something went wrong in get average data controller : ",
      error
    );
  }
};

export { getExportData, getAverageData };
