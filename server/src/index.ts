import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";
import { resolvers } from "./resolvers";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(morgan("dev"));

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true, // 启用 GraphiQL 工具
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
