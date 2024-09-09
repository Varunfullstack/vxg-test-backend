import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import { AppDataSource } from "./data-source";
import UserRoutes from "./routes/UserRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/users", UserRoutes);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World");
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.error(error));
