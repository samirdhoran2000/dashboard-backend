import express from "express";
// import db from "./config/db.config.js";
import exportRouter from "./routes/export.routes.js";

const app = express();
const PORT = process.env.port || 3000;

app.use(express.json());
app.use("/exportData", exportRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
//   db(`select * from cosmo_table1 limit 10`);
});
