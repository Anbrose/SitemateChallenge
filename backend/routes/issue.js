const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");

const app = express();

require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = "Sitemate-issue-table";

router.post("/", async (req, res) => {
  const { title, description } = req.body;
  const id = uuidv4();
  const params = {
    TableName: tableName,
    Item: { id, title, description },
  };

  try {
    await dynamodb.put(params).promise();
    res.status(201).json({
      id: id,
      title: title,
      description: description,
    });
  } catch (error) {
    res.status(500).json({
      error: "Cannot create the issue",
    });
  }
});

router.get("/", async (req, res) => {
  const params = {
    TableName: tableName,
  };

  try {
    const result = await dynamodb.scan(params).promise();
    res.json(result.Items);
  } catch (error) {
    res.status(500).json({
      error: "Cannot get issues",
    });
  }
});

router.get("/:id", async (req, res) => {
  const params = {
    TableName: tableName,
    Key: { id: req.params.id },
  };

  try {
    const result = await dynamodb.get(params).promise();
    res.json(result.Item);
  } catch (error) {
    res.status(500).json({
      error: " cannot get issue with id",
      id,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const params = {
    TableName: tableName,
    Key: { id: req.params.id },
  };

  try {
    await dynamodb.delete(params).promise();
    res.json({ message: "Successfully delete" });
  } catch (error) {
    res.status(500).json({ error: "Cannot delete issue id", id });
  }
});

module.exports = router;
