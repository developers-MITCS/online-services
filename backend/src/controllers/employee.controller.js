const Employee = require("../models/employee.model");
const response = require("../utils/response.utils");

exports.getAll = async (req, res) => {
  try {
    const data = await Employee.getAll();

    return response.success(res, "Employees retrieved successfully", data, 200);
  } catch (err) {
    console.error(err);

    return response.error(
      res,
      "Failed to retrieve Employees",
      err.message,
      500,
    );
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Employee.getById(req.params.id);

    if (!data) {
      return response.error(res, "Employee not found", "NOT_FOUND", 404);
    }

    return response.success(res, "Employee retrieved successfully", data, 200);
  } catch (err) {
    console.error(err);

    return response.error(res, "Failed to retrieve Employee", err.message, 500);
  }
};

exports.create = async (req, res) => {
  try {
    const {
      employee_no,
      first_name,
      middle_name,
      last_name,
      suffix,
      email,
      phone,
      department_id,
      status,
    } = req.body;

    const id = await Employee.create({
      employee_no,
      first_name,
      middle_name,
      last_name,
      suffix,
      email,
      phone,
      department_id,
      status,
    });

    return response.success(res, "Employee created successfully", { id }, 201);
  } catch (err) {
    console.error(err);

    return response.error(res, "Failed to create Employee", err.message, 500);
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Employee.getById(req.params.id);

    if (!existing) {
      return response.error(res, "Employee not found", "NOT_FOUND", 404);
    }

    const {
      employee_no,
      first_name,
      middle_name,
      last_name,
      suffix,
      email,
      phone,
      department_id,
      status,
    } = req.body;

    await Employee.update(req.params.id, {
      employee_no,
      first_name,
      middle_name,
      last_name,
      suffix,
      email,
      phone,
      department_id,
      status,
    });

    return response.success(res, "Employee updated successfully", null, 200);
  } catch (err) {
    console.error(err);

    return response.error(res, "Failed to update Employee", err.message, 500);
  }
};

exports.delete = async (req, res) => {
  try {
    const existing = await Employee.getById(req.params.id);

    if (!existing) {
      return response.error(res, "Employee not found", "NOT_FOUND", 404);
    }

    await Employee.delete(req.params.id);

    return response.success(res, "Employee deleted successfully", null, 200);
  } catch (err) {
    console.error(err);

    return response.error(res, "Failed to delete Employee", err.message, 500);
  }
};

exports.getByDepartment = async (req, res) => {
  try {
    const { department_id } = req.params;

    const data = await Employee.getByDepartmentId(department_id);

    return response.success(res, "Employees retrieved successfully", data, 200);
  } catch (err) {
    console.error(err);

    return response.error(
      res,
      "Failed to retrieve Employees by department",
      err.message,
      500,
    );
  }
};
