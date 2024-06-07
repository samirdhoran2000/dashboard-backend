import db from "../config/db.config.js";

const getExportData = async (req, res) => {
  try {
    const { rows, fields } = await db("select * from cosmo_table1 limit 1000");

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
    const { country } = req.query;
    console.log(country);
    if (country) {
      const { rows, fields } = await db(
        `select  consignee_name, avg(quantity), avg(unit_fob_inr), count(consignee_name) from cosmoDB.cosmo_table1 where foreign_country='${country}' group by consignee_name`
      );
      res.json({
        msg: "data get successfully ",
        result: {
          rows,
        },
      });
    } else {
      const { rows, fields } = await db(
        `select  consignee_name, avg(quantity), avg(unit_fob_inr), count(consignee_name) from cosmoDB.cosmo_table1 group by consignee_name limit 1000`
      );

      res.json({
        msg: "data get successfully ",
        result: {
          rows,
        },
      });
    }
  } catch (error) {
    console.log(
      "something went wrong in get average data controller : ",
      error
    );
  }
};

export { getExportData, getAverageData };
