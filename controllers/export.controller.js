import db from "../config/db.config.js";

const getExportData = async(req, res) => {
    try {
        const {rows, fields} = await db('select * from cosmo_table1 limit 10');

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

export { getExportData };
