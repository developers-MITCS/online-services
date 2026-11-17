const db = require("../config/db");

const ApiLog = {
  async create(data) {
    const { method, url, status_code, ip, user_agent, user_id, duration_ms } =
      data;

    await db.query(
      `INSERT INTO api_logs 
      (method, url, status_code, ip, user_agent, user_id, duration_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [method, url, status_code, ip, user_agent, user_id || null, duration_ms],
    );
  },
};

module.exports = ApiLog;
