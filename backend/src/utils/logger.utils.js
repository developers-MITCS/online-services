const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");

// ensure logs folder exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const writeLog = (level, message, meta = null) => {
  const logLine = `[${getTimestamp()}] [${level}] ${message} ${
    meta ? JSON.stringify(meta) : ""
  }\n`;

  fs.appendFileSync(path.join(logDir, "app.log"), logLine, "utf8");

  console.log(logLine.trim());
};

const logger = {
  info: (message, meta) => {
    writeLog("INFO", message, meta);
  },

  warn: (message, meta) => {
    writeLog("WARN", message, meta);
  },

  error: (message, meta) => {
    writeLog("ERROR", message, meta);
  },

  debug: (message, meta) => {
    if (process.env.NODE_ENV !== "production") {
      writeLog("DEBUG", message, meta);
    }
  },
};

module.exports = logger;
