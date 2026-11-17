const Department = require("../models/department.model");
const response = require("../utils/response.utils");

exports.getAll = async (req, res) => {
  try {
    const data = await Department.getAll();

    return response.success(
      res,
      "Departments retrieved successfully",
      data,
      200,
    );
  } catch (err) {
    console.error(err);

    return response.error(
      res,
      "Failed to retrieve departments",
      err.message,
      500,
    );
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Department.getById(req.params.id);

    if (!data) {
      return response.error(res, "Department not found", "NOT_FOUND", 404);
    }

    return response.success(
      res,
      "Department retrieved successfully",
      data,
      200,
    );
  } catch (err) {
    console.error(err);

    return response.error(
      res,
      "Failed to retrieve department",
      err.message,
      500,
    );
  }
};

exports.create = async (req, res) => {
  try {
    const id = await Department.create(req.body);

    return response.success(
      res,
      "Department created successfully",
      { id },
      201,
    );
  } catch (err) {
    console.error(err);

    return response.error(res, "Failed to create department", err.message, 500);
  }
};

exports.update = async (req, res) => {
  try {
    const department = await Department.getById(req.params.id);

    if (!department) {
      return response.error(res, "Department not found", "NOT_FOUND", 404);
    }

    await Department.update(req.params.id, req.body);

    return response.success(res, "Department updated successfully", null, 200);
  } catch (err) {
    console.error(err);

    return response.error(res, "Failed to update department", err.message, 500);
  }
};

exports.delete = async (req, res) => {
  try {
    const department = await Department.getById(req.params.id);

    if (!department) {
      return response.error(res, "Department not found", "NOT_FOUND", 404);
    }

    await Department.delete(req.params.id);

    return response.success(res, "Department deleted successfully", null, 200);
  } catch (err) {
    console.error(err);

    return response.error(res, "Failed to delete department", err.message, 500);
  }
};
