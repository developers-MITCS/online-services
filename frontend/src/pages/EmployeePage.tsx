import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { DataTable, Column } from "../components/DataTable";
import { PlusIcon, PencilIcon, TrashIcon, XIcon, EyeIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createApiClient } from "../utils/api";
import { useNavigate } from "react-router-dom";

export function EmployeePage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiFetch = createApiClient(() => token, logout);
  const [showModal, setShowModal] = useState(false);
  const [editingMembers, setEditingMembers] = useState<any>(null);

  const [departments, setDepartments] = useState<any[]>([]);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [filters, setFilters] = useState({
    department_id: "",
    status: "",
  });

  const emptyForm = {
    employee_no: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    email: "",
    phone: "",
    department_id: "",
    status: "ACTIVE",
  };

  const [formData, setFormData] = useState(emptyForm);

  // ======================
  // FETCH DEPARTMENTS (SECURED)
  // ======================
  const fetchDepartments = async () => {
    try {
      const res = await apiFetch("/departments");

      if (!res) return; // auto logout handled

      const json = await res.json();
      setDepartments(json.data || []);
    } catch (err) {
      console.error("Failed to fetch departments");
    }
  };

  // ======================
  // FETCH MEMBERS (SECURED)
  // ======================
  const fetchMembers = async (customFilters = filters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (customFilters.department_id) {
        params.append("department_id", customFilters.department_id);
      }

      if (customFilters.status) {
        params.append("status", customFilters.status);
      }

      const res = await apiFetch(`/members?${params.toString()}`);

      if (!res) return; // auto logout handled

      const json = await res.json();

      setMembers(json.data ?? json);
    } catch (err) {
      setError("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchDepartments();
  }, []);

  // ======================
  // INPUT HANDLER
  // ======================
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
    setEditingMembers(null);
    setFormData(emptyForm);
  };

  const handleEdit = (row: any) => {
    setEditingMembers(row);

    setFormData({
      employee_no: row.employee_no,
      first_name: row.first_name,
      middle_name: row.middle_name || "",
      last_name: row.last_name,
      suffix: row.suffix || "",
      email: row.email,
      phone: row.phone,
      department_id: row.department_id,
      status: row.status,
    });

    setShowModal(true);
  };

  // ======================
  // SAVE (SECURED)
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingMembers ? `/members/${editingMembers.id}` : `/members`;

      const method = editingMembers ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (!res) return;

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Save failed");
      }

      setAlert({
        type: "success",
        message: editingMembers ? "Updated successfully" : "Saved successfully",
      });

      resetModal();
      await fetchMembers();
    } catch (err) {
      setAlert({
        type: "error",
        message: "Save failed",
      });
    }

    setTimeout(() => setAlert(null), 3000);
  };

  // ======================
  // DELETE (SECURED)
  // ======================
  const handleDelete = async (row: any) => {
    if (!window.confirm("Delete this member?")) return;

    try {
      const res = await apiFetch(`/members/${row.id}`, {
        method: "DELETE",
      });

      if (!res) return;

      if (!res.ok) throw new Error();

      setAlert({
        type: "success",
        message: "Deleted successfully",
      });

      await fetchMembers();
    } catch (err) {
      setAlert({
        type: "error",
        message: "Delete failed",
      });
    }

    setTimeout(() => setAlert(null), 3000);
  };

  // ======================
  // TABLE
  // ======================
  const membersColumns: Column<(typeof members)[0]>[] = [
    { header: "Employee No", accessor: "employee_no", sortable: true },

    {
      header: "Name",
      accessor: (row) =>
        `${row.first_name} ${row.middle_name || ""} ${row.last_name} ${
          row.suffix || ""
        }`,
    },

    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Department", accessor: "department_initial" },

    {
      header: "Status",
      accessor: (row) => (
        <Badge variant={row.status === "ACTIVE" ? "success" : "default"}>
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
            onClick={() => handleViewMember(row)}
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

  const handleViewMember = (row: any) => {
    navigate(`/memberrecords`, {
      state: { member: row },
    });
  };

  return (
    <div className="space-y-6">
      {alert && (
        <div
          className={`p-3 rounded ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {alert.message}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingMembers(null);
            setFormData(emptyForm);
            setShowModal(true);
          }}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={membersColumns}
          data={members}
          searchPlaceholder="Search employees..."
          searchKey="employee_no"
        />
      </Card>

      {/* MODAL (UNCHANGED UI) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex justify-between p-5 border-b">
              <h2>{editingMembers ? "Edit Members" : "Add Members"}</h2>

              <button onClick={resetModal}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <input
                name="employee_no"
                value={formData.employee_no}
                onChange={handleInputChange}
                placeholder="Employee Number"
                className="w-full border p-2 rounded"
              />

              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full border p-2 rounded"
              />

              <input
                name="middle_name"
                value={formData.middle_name}
                onChange={handleInputChange}
                placeholder="Middle Name"
                className="w-full border p-2 rounded"
              />

              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full border p-2 rounded"
              />

              <input
                name="suffix"
                value={formData.suffix}
                onChange={handleInputChange}
                placeholder="Suffix (Jr., Sr., III)"
                className="w-full border p-2 rounded"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full border p-2 rounded"
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full border p-2 rounded"
              />

              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Department</option>

                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_initial}
                  </option>
                ))}
              </select>

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <div className="flex justify-end gap-2">
                <Button type="button" onClick={resetModal}>
                  Cancel
                </Button>

                <Button type="submit">
                  {editingMembers ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
