const url = require("url");
const needle = require("needle");
const router = require("express").Router();
const apicache = require("apicache");

// Initialize cache
let cache = apicache.middleware

// Env vars
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

router.get("/", cache("2 minutes"), async (req, res) => {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      units: "metric",
      ...url.parse(req.url, true).query,
    });

    const apiRes = await needle("get", `${API_BASE_URL}?${params}`);
    const data = apiRes.body;

    // Log the request to the public API
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}?${params}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
