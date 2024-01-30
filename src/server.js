import dotenv from "dotenv";
import app from "./app";
import db from "./database/models";

const port = process.env.PORT;
dotenv.config();
app.listen(port, () => {
  console.log("server started,", port);
});
console.log(process.env.PROD_DATABASE_URL);

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to the database has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
export default app;
