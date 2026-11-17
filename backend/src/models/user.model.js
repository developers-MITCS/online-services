const db = require("../config/db");

class UserModel {
  static table = "users";

  static async getAll() {
    const [rows] = await db.query(
      `SELECT * FROM ${this.table} `,
    );

    return rows;
  }

  static async create(userData) {
    const fields = Object.keys(userData);
    const values = Object.values(userData);

    const placeholders = fields.map(() => "?").join(",");

    const sql = `
      INSERT INTO ${this.table}
      (${fields.join(",")})
      VALUES (${placeholders})
    `;

    const [result] = await db.query(sql, values);

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`,
      [id],
    );

    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT * FROM ${this.table} WHERE email = ? LIMIT 1`,
      [email],
    );

    return rows[0] || null;
  }

  static async findAll() {
    const [rows] = await db.query(
      `SELECT * FROM ${this.table} ORDER BY id DESC`,
    );

    return rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data);

    const setClause = fields.map((field) => `${field}=?`).join(",");

    const values = [...Object.values(data), id];

    const [result] = await db.query(
      `UPDATE ${this.table}
       SET ${setClause}
       WHERE id=?`,
      values,
    );

    return result;
  }

  static async delete(id) {
    const [result] = await db.query(`DELETE FROM ${this.table} WHERE id=?`, [
      id,
    ]);

    return result;
  }
}

module.exports = UserModel;
