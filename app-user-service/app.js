const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const app = express();
const PORT = 8080; // All services run on 8080 inside their *own* container
app.use(express.json());
const client = new DynamoDBClient({ region: "ap-south-1" }); // <<< MAKE SURE THIS IS YOUR REGION
const docClient = DynamoDBDocumentClient.from(client);
const USERS_TABLE = "pune-pulse-users";

app.post('/api/users/register', async (req, res) => {
  const { name, age, profession, hobbies, area, email } = req.body;
  const userId = uuidv4();
  const command = new PutCommand({
    TableName: USERS_TABLE,
    Item: { userId, name, age, profession, hobbies, area, email },
  });
  try {
    await docClient.send(command);
    res.status(201).json({ message: "User created", userId });
  } catch (err) {
    res.status(500).json({ message: "Could not create user", error: err.message });
  }
});

app.get('/api/users/user/:userId', async (req, res) => {
  const command = new GetCommand({
    TableName: USERS_TABLE,
    Key: { userId: req.params.userId },
  });
  try {
    const { Item } = await docClient.send(command);
    if (Item) res.status(200).json(Item);
    else res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: "Could not get user", error: err.message });
  }
});

app.get('/health', (req, res) => res.status(200).json({ status: "OK" }));
app.listen(PORT, () => console.log(`User Service on port ${PORT}`));