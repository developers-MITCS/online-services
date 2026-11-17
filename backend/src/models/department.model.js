const db = require("../config/db");

const Department = {
  async getAll() {
    const [rows] = await db.query("SELECT * FROM departments ORDER BY id DESC");

    return rows;
  },

  async getById(id) {
    const [rows] = await db.query("SELECT * FROM departments WHERE id=?", [id]);

    return rows[0];
  },

  async create(data) {
    const { department_code, department_initial, department_name, status } =
      data;

    const [result] = await db.query(
      `INSERT INTO departments 
       (
        department_code,
        department_initial,
        department_name,
        status,
        created_at
       )
       VALUES (?, ?, ?, ?, NOW())`,
      [
        department_code,
        department_initial,
        department_name,
        status || "active",
      ],
    );

    return result.insertId;
  },

  async update(id, data) {
    const { department_code, department_initial, department_name, status } =
      data;

    await db.query(
      `UPDATE departments 
       SET 
        department_code=?,
        department_initial=?,
        department_name=?,
        status=? 
       WHERE id=?`,
      [department_code, department_initial, department_name, status, id],
    );

    return true;
  },

  async delete(id) {
    await db.query("DELETE FROM departments WHERE id=?", [id]);

    return true;
  },
};

module.exports = Department;
