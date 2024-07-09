const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cron = require("node-cron");
const cors = require("cors");
const Data = require("./DataModel");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());
mongoose.connect(MONGO_URI).then(() => console.log("MongoDB connected"));

const fetchData = async (symbol) => {
  try {
    const response = await axios.post(
      "https://api.livecoinwatch.com/coins/single",
      {
        currency: "USD",
        code: symbol,
        meta: true,
      },
      {
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      }
    );

    if (response.data) {
      const { rate, allTimeHighUSD, volume } = response.data;
      const newData = new Data({
        symbol,
        price: rate,
        allTimeHigh: allTimeHighUSD,
        volume: volume,
        timestamp: new Date(),
      });
      await newData.save();
      console.log(`Data saved for ${symbol}`);
    }
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
  }
};

const symbols = ["BTC", "ETH", "USDT"];
// symbols.forEach((symbol) => {
//   cron.schedule("*/5 * * * * *", () => fetchData(symbol));
// });

app.get("/api/getData/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const dataEntries = await Data.find(
      { symbol: symbol.toUpperCase() },
      { _id: 0, symbol: 1, price: 1, allTimeHigh: 1, volume: 1, timestamp: 1 }
    )
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Data.countDocuments({ symbol: symbol.toUpperCase() });

    res.json({
      data: dataEntries,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to fetch data for ${symbol}`, error });
  }
});

app.get("/api/symbols", async (req, res) => {
  try {
    const symbols = await Data.distinct("symbol");
    res.json(symbols);
  } catch (error) {
    res.status(500).send("Failed to fetch symbols");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
