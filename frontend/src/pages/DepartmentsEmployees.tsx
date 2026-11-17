import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { DataTable, Column } from "../components/DataTable";
import { PlusIcon, PencilIcon, TrashIcon, XIcon, EyeIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createApiClient } from "../utils/api";

export function DepartmentsEmployees() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiFetch = createApiClient(() => token, logout);

  const location = useLocation();
  const department = location.state?.department;

  const [departments, setDepartments] = useState<any[]>([]);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [filters, setFilters] = useState({
    department_id: "",
    status: "",
  });

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

      const res = await apiFetch(`/members/department/${department?.id}`);

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
  }, []);

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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
      >
        <span className="text-sm font-medium">← Back</span>
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {department?.department_name}
        </h1>
      </div>
      {alert && (
        <div
          className={`p-3 rounded ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {alert.message}
        </div>
      )}

      <Card className="p-6">
        <DataTable
          columns={membersColumns}
          data={members}
          searchPlaceholder="Search employees..."
          searchKey="employee_no"
        />
      </Card>
    </div>
  );
}
