import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { DataTable, Column } from "../components/DataTable";
import { PlusIcon, PencilIcon, TrashIcon, XIcon, EyeIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createApiClient } from "../utils/api";
import { useNavigate } from "react-router-dom";

export function DepartmentPage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const apiFetch = createApiClient(() => token, logout);

  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const emptyForm = {
    department_code: "",
    department_initial: "",
    department_name: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyForm);

  // =========================
  // FETCH DEPARTMENTS (SECURE + AUTO 401 HANDLING)
  // =========================
  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const response = await apiFetch("/departments");

      if (!response) return; // handled by apiFetch (401 redirect)

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch departments");
      }

      setDepartments(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
    setFormData(emptyForm);
  };

  const handleEdit = (row: any) => {
    setEditingDepartment(row);

    setFormData({
      department_code: row.department_code,
      department_initial: row.department_initial || "",
      department_name: row.department_name,
      status: row.status,
    });

    setShowModal(true);
  };

  const handleViewMembers = (row: any) => {
    navigate(`/departmentsemployee`, {
      state: { department: row },
    });
  };

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingDepartment
        ? `/departments/${editingDepartment.id}`
        : `/departments`;

      const method = editingDepartment ? "PUT" : "POST";

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (!response) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Save failed");
      }

      setAlert({
        type: "success",
        message: editingDepartment
          ? "Department updated successfully"
          : "Department saved successfully",
      });

      resetModal();
      await fetchDepartments();
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Unable to save department",
      });
    }

    setTimeout(() => setAlert(null), 3000);
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (row: any) => {
    const confirmDelete = window.confirm(
      `Delete department "${row.department_name}"?`,
    );

    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/departments/${row.id}`, {
        method: "DELETE",
      });

      if (!response) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setAlert({
        type: "success",
        message: "Department deleted successfully",
      });

      await fetchDepartments();
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Failed to delete department",
      });
    }

    setTimeout(() => setAlert(null), 3000);
  };

  const deptColumns: Column<(typeof departments)[0]>[] = [
    {
      header: "Deptartment Initial",
      accessor: "department_initial",
    },
    {
      header: "Department",
      accessor: "department_name",
    },
    {
      header: "Status",
      accessor: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "default"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewMembers(row)}
          >
            <EyeIcon className="h-4 w-4 text-green-600" />
          </Button>

          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <PencilIcon className="h-4 w-4 text-blue-600" />
          </Button>

          <Button variant="ghost" size="sm" onClick={() => handleDelete(row)}>
            <TrashIcon className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingDepartment(null);
            setFormData(emptyForm);
            setShowModal(true);
          }}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Department
        </Button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex justify-between p-5 border-b">
              <h2>
                {editingDepartment ? "Edit Department" : "Add Department"}
              </h2>

              <button onClick={resetModal}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <input
                name="department_initial"
                value={formData.department_initial}
                onChange={handleInputChange}
                placeholder="Department Initial"
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="department_code"
                value={formData.department_code}
                onChange={handleInputChange}
                placeholder="Department Code"
                className="w-full border p-2 rounded"
              />

              <input
                name="department_name"
                value={formData.department_name}
                onChange={handleInputChange}
                placeholder="Department Name"
                className="w-full border p-2 rounded"
                required
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-2">
                <Button type="button" onClick={resetModal}>
                  Cancel
                </Button>

                <Button type="submit">
                  {editingDepartment ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Card className="p-6">
        <DataTable
          columns={deptColumns}
          data={departments}
          searchPlaceholder="Search departments..."
          searchKey="department_name"
        />
      </Card>
    </div>
  );
}
