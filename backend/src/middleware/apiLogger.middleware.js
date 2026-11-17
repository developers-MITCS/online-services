const ApiLog = require("../models/apiLog.model");

const apiLogger = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;

    try {
      await ApiLog.create({
        method: req.method,
        url: req.originalUrl,
        status_code: res.statusCode,
        ip: req.ip,
        user_agent: req.headers["user-agent"],
        user_id: req.user?.id || null,
        duration_ms: duration,
      });
    } catch (err) {
      console.error("API log failed:", err.message);
    }
  });

  next();
};

module.exports = apiLogger;
