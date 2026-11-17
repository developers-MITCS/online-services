import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { DataTable, Column } from "../components/DataTable";
import { PlusIcon, PencilIcon, TrashIcon, XIcon, EyeIcon } from "lucide-react";

export function MemberRecords() {
  const navigate = useNavigate();
  const location = useLocation();

  const member = location.state?.member;

  const [error, setError] = useState<string | null>(null);

  const [showTransModal, setShowTransModal] = useState(false);

  const [form, setForm] = useState({
    member_id: "",
    Trans_type_id: "",
    Trans_amount: "",
    interest_rate: "",
    term_months: "",
    application_date: "",
  });

  if (!member) {
    return (
      <div className="p-6">
        <p className="text-red-500">No member data found.</p>

        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const selectedMember = member;

  const getFullName = (m: any) =>
    `${m.first_name ?? ""} ${m.middle_name ?? ""} ${
      m.last_name ?? ""
    } ${m.suffix ?? ""}`.trim();

  const formatMoney = (value: number | string) =>
    `₱ ${Number(value || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
    })}`;

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString("en-PH") : "-";

  const openTransModal = async () => {
    setShowTransModal(true);

    setForm({
      member_id: selectedMember.id,
      Trans_type_id: "",
      Trans_amount: "",
      interest_rate: "",
      term_months: "",
      application_date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
      >
        <span className="text-sm font-medium">← Back</span>
      </button>

      {/* MEMBER HEADER */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
              {`${selectedMember.first_name?.[0] ?? ""}${
                selectedMember.last_name?.[0] ?? ""
              }`}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {getFullName(selectedMember)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-gray-500">Member ID:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {selectedMember.employee_no}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">Department:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {selectedMember.department_initial}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">Registered:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {selectedMember.created_at}
                  </span>
                </div>
              </div>
            </div>

            <Badge
              variant={
                selectedMember.status === "ACTIVE" ? "success" : "warning"
              }
            >
              {selectedMember.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex">
        <Button onClick={openTransModal}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Transactions
        </Button>
      </div>
      {/* Trans APPLICATIONS */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transactions
        </h3>

        <Card className="p-6"></Card>

        {/* MODAL */}
        {showTransModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded-lg p-6">
              <div className="flex justify-between mb-5">
                <h3 className="font-bold">Add Transactions</h3>

                <button onClick={() => setShowTransModal(false)}>
                  <XIcon />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label>Document</label>

                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={form.Trans_amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        Trans_amount: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label>Amount</label>

                  <input
                    className="w-full border p-2 rounded bg--100"
                    value={form.interest_rate}
                  />
                </div>

                <div>
                  <label> Date</label>

                  <input
                    className="w-full border p-2 rounded bg--100"
                    value={form.application_date}
                  />
                </div>

                <Button className="w-full">Submit Application</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
