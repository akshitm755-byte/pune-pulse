const express = require('express');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const app = express();
const PORT = 8080;
app.use(express.json());
const client = new DynamoDBClient({ region: "ap-south-1" }); // <<< MAKE SURE THIS IS YOUR REGION
const docClient = DynamoDBDocumentClient.from(client);
const SCHEDULE_TABLE = "pune-pulse-schedule";

app.post('/api/schedule/accept', async (req, res) => {
  const { userId, hangoutId } = req.body;
  const command = new PutCommand({
    TableName: SCHEDULE_TABLE,
    Item: { userId, hangoutId, status: "accepted", acceptedAt: new Date().toISOString() },
  });
  try {
    await docClient.send(command);
    res.status(200).json({ message: "Hangout accepted!" });
  } catch (err) {
    res.status(500).json({ message: "Could not accept hangout", error: err.message });
  }
});

app.get('/api/schedule/scheduled/:userId', async (req, res) => {
  const { userId } = req.params;
  const command = new QueryCommand({
    TableName: SCHEDULE_TABLE,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: { ":uid": userId }
  });
  try {
    const { Items } = await docClient.send(command);
    res.status(200).json(Items);
  } catch (err) {
    res.status(500).json({ message: "Could not get scheduled hangouts", error: err.message });
  }
});

app.get('/health', (req, res) => res.status(200).json({ status: "OK" }));
app.listen(PORT, () => console.log(`Schedule Service on port ${PORT}`));