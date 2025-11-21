const getHomeInfo = (req, res) => {
  const name = process.env.APP_NAME || "napwork!";
  res.json({ info: `Hello ${name}` });
};

module.exports = { getHomeInfo };