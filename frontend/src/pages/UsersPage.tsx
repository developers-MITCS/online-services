import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/DataTable';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XIcon
} from 'lucide-react';

export function UsersPage() {
  const [users, setusers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [editingusers, setEditingusers] =
    useState<any>(null);

  const [alert, setAlert] =
    useState<{
      type: 'success' | 'error';
      message: string;
    } | null>(null);

  const emptyForm = {
    middlename: '',
    firstname: '',
    lastname: '',
    email: '',
    suffix: '',
    username: '',
    role: '',
    password: '',
    status: 'Active'
  };

  const [formData, setFormData] =
    useState(emptyForm);

  const fetchusers = async () => {
    try {
      setLoading(true);

      const response =
        await fetch(
          'http://localhost:5002/auth/users'
        );

      const data =
        await response.json();

      setusers(
        data.data || []
      );
    } catch (err) {
      setError(
        'Failed to fetch users'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchusers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingusers(null);
    setFormData(emptyForm);
  };

  const handleEdit = (
    row: any
  ) => {
    setEditingusers(row);

    setFormData({
      middlename:
        row.middlename,
      firstname:
        row.firstname,
      lastname:
        row.lastname,
      email:
        row.email,
      suffix:
        row.suffix,
      username:
        row.username,
      role:
        row.role,
      password:
        row.password,
      status:
        row.status
    });

    setShowModal(true);
  };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        const url =
          editingusers
            ? `http://localhost:5002/users/${editingusers.id}`
            : `http://localhost:5002/auth/register`;

        const method =
          editingusers
            ? 'PUT'
            : 'POST';

        const response =
          await fetch(
            url,
            {
              method,
              headers: {
                'Content-Type':
                  'application/json'
              },
              body:
                JSON.stringify(
                  formData
                )
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            'Save failed'
          );
        }

        setAlert({
          type:
            'success',
          message:
            editingusers
              ? 'users updated successfully'
              : 'users saved successfully'
        });

        resetModal();

        await fetchusers();

      } catch (err) {
        setAlert({
          type:
            'error',
          message:
            'Unable to save users'
        });
      }

      setTimeout(
        () =>
          setAlert(
            null
          ),
        3000
      );
    };

  const handleDelete = async (row: any) => {
    const confirmDelete = window.confirm(
      `Delete user "${row.username}"?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5002/users/${row.id}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setAlert({
        type: 'success',
        message: 'user deleted successfully'
      });

      await fetchusers();
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to delete user'
      });
    }

    setTimeout(() => setAlert(null), 3000);
  };

   const usersColumns: Column<(typeof users)[0]>[] = [
    {
      header: 'Name',
      accessor: (row) => `${row.firstname} ${row.middlename} ${row.lastname} ${row.suffix}`,
      sortable: true
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true
    },
    {
      header: 'Username',
      accessor: 'username',
      sortable: true
    },
    {
      header: 'Role',
      accessor: 'role',
      sortable: true
    },
    {
      header: 'Status',
      accessor: (row) =>
      <Badge variant={row.status === 'Active' ? 'success' : 'default'}>
            {row.status}
          </Badge>

    },
    {
      header:
        'Actions',
      accessor:
        (
          row
        ) => (
          <div className="flex gap-2">

            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleEdit(
                  row
                )
              }
            >
              <PencilIcon className="h-4 w-4 text-blue-600" />
            </Button> */}

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleDelete(
                  row
                )
              }
            >
              <TrashIcon className="h-4 w-4 text-red-600" />
            </Button>

          </div>
        )
    }
  ];

  return (
    <div className="space-y-6">

      {/* Alert */}
      {alert && (
        <div
          className={`p-3 rounded-lg text-white ${
            alert.type ===
            'success'
              ? 'bg-green-600'
              : 'bg-red-600'
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingusers(
              null
            );

            setFormData(
              emptyForm
            );

            setShowModal(
              true
            );
          }}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New user
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-xl w-full max-w-md">

            <div className="flex justify-between p-5 border-b">

              <h2>
                {editingusers
                  ? 'Edit users'
                  : 'Add users'}
              </h2>

              <button
                onClick={
                  resetModal
                }
              >
                <XIcon />
              </button>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="p-5 space-y-4"
            >

              <input
                name="firstname"
                value={
                  formData.firstname
                }
                onChange={
                  handleInputChange
                }
                placeholder="First Name"
                className="w-full border p-2 rounded"
              />

                <input
                name="middlename"
                value={
                  formData.middlename
                }
                onChange={
                  handleInputChange
                }
                placeholder="Middle Name"
                className="w-full border p-2 rounded"
              />

              <input
                name="lastname"
                value={
                  formData.lastname
                }
                onChange={
                  handleInputChange
                }
                placeholder="Last Name"
                className="w-full border p-2 rounded"
              />

              <input
                name="suffix"
                value={
                  formData.suffix
                }
                onChange={
                  handleInputChange
                }
                placeholder="suffix"
                className="w-full border p-2 rounded"
              />

              <input
                name="username"
                value={
                  formData.username
                }
                onChange={
                  handleInputChange
                }
                placeholder="Username"
                className="w-full border p-2 rounded"
              />

              <input
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleInputChange
                }
                placeholder="Email"
                className="w-full border p-2 rounded"
              />

              <input
                name="password"
                type="password"
                value={
                  formData.password
                }
                onChange={
                  handleInputChange
                }
                placeholder="Password"
                className="w-full border p-2 rounded"
              />

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleInputChange
                }
                className="w-full border p-2 rounded"
              >
                <option>
                  Active
                </option>

                <option>
                  Inactive
                </option>

              </select>

              <div className="flex justify-end gap-2">

                <Button
                  type="button"
                  onClick={
                    resetModal
                  }
                >
                  Cancel
                </Button>

                <Button type="submit">
                  {editingusers
                    ? 'Update'
                    : 'Save'}
                </Button>

              </div>

            </form>

          </div>

        </div>
      )}

      <Card className="p-6">

        <DataTable
          columns={
            usersColumns
          }
          data={
            users
          }
          searchPlaceholder="Search users..."
          searchKey="username"
        />

      </Card>

    </div>
  );
}