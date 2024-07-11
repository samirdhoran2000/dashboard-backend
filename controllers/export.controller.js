import db from "../config/db.config.js";

import { logMemoryUsage } from "../utils/logger.js";

const getExportData = async (req, res) => {
  let { product } = req.query;
  product = product.toLowerCase();

  try {
    let query = "";
    if (!product || product === "leather") {
      query = `SELECT * FROM cosmo_leather_table5`;
    }
    if (!product || product === "cotton") {
      query = `${
        query ? `${query} UNION ` : ""
      }SELECT * FROM cosmo_cotton_table6`;
    }

    const { rows } = await db(query);

    res.json({
      msg: "Data fetched successfully",
      result: {
        rows,
      },
    });
    logMemoryUsage(getExportData);
  } catch (error) {
    console.log("Error in getExportData:", error);
  }
};

const getAverageData = async (req, res) => {
  let { product } = req.query;
  product = product.toLowerCase();

  try {
    let query = `
      SELECT
        foreign_country,
        AVG(total_inr_ammount / quantity) AS average_price,
        AVG(quantity) AS average_quantity,
        COUNT(DISTINCT consignee_name) AS consignee_count
      FROM
        cosmoDB.${
          product === "cotton" ? "cosmo_cotton_table6" : "cosmo_leather_table5"
        }
      GROUP BY
        foreign_country`;

    if (!product || product === "leather") {
      const { rows } = await db(query);
      const { rows: allRow } = await db(`
        SELECT
          AVG(total_inr_ammount / quantity) AS average_price,
          AVG(quantity) AS average_quantity,
          COUNT(DISTINCT consignee_name) AS consignee_count
        FROM
          cosmoDB.cosmo_leather_table5`);
      allRow[0]["foreign_country"] = "All";
      rows.unshift(allRow[0]);
      res.json({
        msg: "Data fetched successfully",
        result: {
          rows,
        },
      });
    } else if (product === "cotton") {
      const { rows } = await db(query);
      const { rows: allRow } = await db(`
        SELECT
          AVG(total_inr_ammount / quantity) AS average_price,
          AVG(quantity) AS average_quantity,
          COUNT(DISTINCT consignee_name) AS consignee_count
        FROM
          cosmoDB.cosmo_cotton_table6`);
      allRow[0]["foreign_country"] = "All";
      rows.unshift(allRow[0]);
      res.json({
        msg: "Data fetched successfully",
        result: {
          rows,
        },
      });
    }
    logMemoryUsage(getAverageData);
  } catch (error) {
    console.log("Error in getAverageData:", error);
  }
};

export { getExportData, getAverageData };
