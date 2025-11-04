const express = require('express');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const app = express();
const PORT = 8080;
app.use(express.json());
const client = new DynamoDBClient({ region: "ap-south-1" }); // <<< MAKE SURE THIS IS YOUR REGION
const docClient = DynamoDBDocumentClient.from(client);
const USERS_TABLE = "pune-pulse-users";
const HANGOUTS_TABLE = "pune-pulse-hangouts";

app.get('/api/filter/eligible/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userResult = await docClient.send(new GetCommand({ TableName: USERS_TABLE, Key: { userId } }));
    if (!userResult.Item) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userResult.Item;

    const hangoutsResult = await docClient.send(new ScanCommand({ TableName: HANGOUTS_TABLE }));
    
    const eligibleHangouts = hangoutsResult.Items.filter(hangout => {
      const f = hangout.filters;
      if (!f) return true;
      const ageMatch = f.age ? (user.age >= f.age.min && user.age <= f.age.max) : true;
      const profMatch = f.profession ? user.profession === f.profession : true;
      const areaMatch = f.area ? user.area === f.area : true;
      const hobbyMatch = f.hobbies ? f.hobbies.some(h => user.hobbies.includes(h)) : true;
      return ageMatch && profMatch && areaMatch && hobbyMatch;
    });
    res.status(200).json(eligibleHangouts);
  } catch (err) {
    res.status(500).json({ message: "Could not get hangouts", error: err.message });
  }
});

app.get('/health', (req, res) => res.status(200).json({ status: "OK" }));
app.listen(PORT, () => console.log(`Filter Service on port ${PORT}`));