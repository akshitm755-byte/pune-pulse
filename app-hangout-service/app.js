const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const app = express();
const PORT = 8080;
app.use(express.json());
const client = new DynamoDBClient({ region: "ap-south-1" }); // <<< MAKE SURE THIS IS YOUR REGION
const docClient = DynamoDBDocumentClient.from(client);
const HANGOUTS_TABLE = "pune-pulse-hangouts";

app.post('/api/hangouts/create', async (req, res) => {
  const { creatorId, name, time, location, description, filters } = req.body;
  const hangoutId = uuidv4();
  const command = new PutCommand({
    TableName: HANGOUTS_TABLE,
    Item: { hangoutId, creatorId, name, time, location, description, filters },
  });
  try {
    await docClient.send(command);
    res.status(201).json({ message: "Hangout created", hangoutId });
  } catch (err) {
    res.status(500).json({ message: "Could not create hangout", error: err.message });
  }
});

app.get('/health', (req, res) => res.status(200).json({ status: "OK" }));
app.listen(PORT, () => console.log(`Hangout Service on port ${PORT}`));