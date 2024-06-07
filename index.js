import express from "express";
import cors from "cors"
import exportRouter from "./routes/export.routes.js";

const app = express();
const PORT = process.env.port || 3000;

app.use(cors({
  origin:"*"
}));
app.use(express.json());
app.use("/api", exportRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
