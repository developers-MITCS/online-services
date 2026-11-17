const db = require("../config/db");

const Member = {
  async getAll(filters = {}) {
    let sql = `
    SELECT m.*, d.department_name, d.department_initial
    FROM employee m
    LEFT JOIN departments d ON m.department_id = d.id
    WHERE 1=1
  `;

    const params = [];

    const dept = filters.department_id;
    const status = filters.status;

    // ✅ FIX: ensure not empty string
    if (dept !== undefined && dept !== null && dept !== "") {
      sql += ` AND m.department_id = ?`;
      params.push(dept);
    }

    if (status !== undefined && status !== null && status !== "") {
      sql += ` AND m.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY m.id DESC`;

    const [rows] = await db.query(sql, params);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query("SELECT * FROM employee WHERE id=?", [id]);

    return rows[0];
  },

  async create(data) {
    const clean = {
      employee_no: data.employee_no?.toUpperCase(),
      department_id: data.department_id,
      first_name: data.first_name?.toUpperCase(),
      middle_name: data.middle_name?.toUpperCase(),
      last_name: data.last_name?.toUpperCase(),
      suffix: data.suffix?.toUpperCase(),
      email: data.email?.toUpperCase(),
      phone: data.phone?.toUpperCase(),
      status: (data.status || "ACTIVE").toUpperCase(),
    };

    const [result] = await db.query(
      `INSERT INTO employee 
      (
        employee_no,
        department_id,
        first_name,
        middle_name,
        last_name,
        suffix,
        email,
        phone,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        clean.employee_no,
        clean.department_id,
        clean.first_name,
        clean.middle_name,
        clean.last_name,
        clean.suffix,
        clean.email,
        clean.phone,
        clean.status,
      ],
    );

    return result.insertId;
  },

  async update(id, data) {
    const clean = {
      employee_no: data.employee_no?.toUpperCase(),
      department_id: data.department_id,
      first_name: data.first_name?.toUpperCase(),
      middle_name: data.middle_name?.toUpperCase(),
      last_name: data.last_name?.toUpperCase(),
      suffix: data.suffix?.toUpperCase(),
      email: data.email?.toUpperCase(),
      phone: data.phone?.toUpperCase(),
      status: (data.status || "ACTIVE").toUpperCase(),
    };

    await db.query(
      `UPDATE employee SET
        employee_no = ?,
        department_id = ?,
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        suffix = ?,
        email = ?,
        phone = ?,
        status = ?
      WHERE id = ?`,
      [
        clean.employee_no,
        clean.department_id,
        clean.first_name,
        clean.middle_name,
        clean.last_name,
        clean.suffix,
        clean.email,
        clean.phone,
        clean.status,
        id,
      ],
    );

    return true;
  },

  async delete(id) {
    await db.query("DELETE FROM employee WHERE id = ?", [id]);

    return true;
  },

  // GET BY DEPARTMENT
  async getByDepartmentId(department_id) {
    const [rows] = await db.query(
      `
      SELECT 
        m.*, 
        d.department_name,
        d.department_initial
      FROM employee m
      LEFT JOIN departments d 
        ON m.department_id = d.id
      WHERE m.department_id = ?
      ORDER BY m.id DESC
      `,
      [department_id],
    );

    return rows;
  },
};

module.exports = Member;
