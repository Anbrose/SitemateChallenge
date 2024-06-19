const express = require("express");
const issueRouter = require("./routes/issue");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 12345;

app.use(bodyParser.json());
app.use(cors());
app.use("/issue", issueRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
