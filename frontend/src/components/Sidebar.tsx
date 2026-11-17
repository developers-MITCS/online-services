import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UsersIcon,
  BookOpenIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CreditCardIcon,
  Building2Icon,
  LayoutDashboardIcon,
  XIcon,
  MenuIcon,
  HomeIcon,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeModule: string;
}

export function Sidebar({ isOpen, setIsOpen, activeModule }: SidebarProps) {
  const navigate = useNavigate();

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    Payroll: false,
    Reports: false,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const flatNavItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
    },

    {
      name: "Department",
      path: "/department",
      icon: <Building2Icon className="w-5 h-5" />,
    },

    {
      name: "Employees",
      path: "/employees",
      icon: <UsersIcon className="w-5 h-5" />,
    },

    {
      name: "Users",
      path: "/users",
      icon: <UsersIcon className="w-5 h-5" />,
    },
  ];

  const expandableCategories = [
    {
      category: "Reports",
      icon: <ChartBarIcon className="w-5 h-5" />,
      items: [
        {
          name: "Employee Report",
          path: "/employee-report",
          icon: <ChartBarIcon className="w-4 h-4" />,
        },

        {
          name: "Department Report",
          path: "/department-report",
          icon: <ChartBarIcon className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);

    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* MOBILE BREADCRUMB */}

      <div
        className="
      lg:hidden
      fixed top-0 left-0 right-0
      h-14
      bg-white
      border-b border-blue-100
      shadow-sm
      z-30
      flex items-center
      px-4 gap-3
      "
      >
        <button
          onClick={() => setIsOpen(true)}
          className="
        bg-blue-700
        text-white
        w-9 h-9
        rounded-lg
        flex items-center justify-center
        "
        >
          <MenuIcon size={20} />
        </button>

        <div className="flex items-center gap-2">
          <HomeIcon size={16} className="text-blue-700" />

          <span className="text-gray-400">/</span>

          <span
            className="
          text-blue-700
          font-semibold
          "
          >
            {activeModule}
          </span>
        </div>
      </div>

      {/* OVERLAY */}

      {isOpen && (
        <div
          className="
        fixed inset-0
        bg-black/40
        z-40
        lg:hidden
        "
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
      fixed
      top-0 left-0
      z-50
      w-64
      h-full
      bg-white
      border-r border-blue-100
      shadow-xl
      flex flex-col
      transition-transform

      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}

      `}
      >
        {/* HEADER */}

        <div
          className="
        h-16
        bg-blue-700
        px-4
        flex items-center justify-between
        "
        >
          <div className="flex items-center gap-3">
            <div
              className="
            bg-white
            w-10 h-10
            rounded-full
            flex items-center justify-center
            "
            >
              <Building2Icon className="text-blue-700" />
            </div>

            <span
              className="
            text-white
            font-bold
            "
            >
              LGU SYSTEM
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="
          lg:hidden
          text-white
          "
          >
            <XIcon />
          </button>
        </div>

        {/* MENU */}

        <div
          className="
        flex-1
        overflow-y-auto
        py-4
        "
        >
          <div className="px-3 space-y-1">
            {flatNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.path)}
                className={`

              w-full
              flex items-center gap-3
              px-3 py-2.5
              rounded-lg


              ${
                activeModule === item.name
                  ? "bg-blue-700 text-white border-l-4 border-yellow-400"
                  : "text-blue-900 hover:bg-blue-50"
              }

              `}
              >
                {item.icon}

                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <div
            className="
          mx-4 my-5
          border-t border-blue-100
          "
          />

          {expandableCategories.map((group) => (
            <div key={group.category}>
              <button
                onClick={() => toggleCategory(group.category)}
                className="
                w-full
                flex justify-between
                px-5 py-2
                text-blue-700
                font-semibold
                "
              >
                <div className="flex gap-3">
                  {group.icon}

                  {group.category}
                </div>

                {expandedCategories[group.category] ? (
                  <ChevronDownIcon size={18} />
                ) : (
                  <ChevronRightIcon size={18} />
                )}
              </button>

              {expandedCategories[group.category] && (
                <div>
                  {group.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleItemClick(item.path)}
                      className={`

                    w-full
                    flex gap-3
                    pl-12 py-2
                    text-sm


                    ${
                      activeModule === item.name
                        ? "bg-yellow-100 border-r-4 border-red-500"
                        : "text-blue-700 hover:bg-blue-50"
                    }

                    `}
                    >
                      {item.icon}

                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER */}

        <div
          className="
        bg-blue-700
        p-4
        "
        >
          <div className="flex items-center gap-3">
            <div
              className="
            bg-yellow-400
            w-10 h-10
            rounded-full
            flex items-center justify-center
            font-bold
            "
            >
              AD
            </div>

            <div>
              <p className="text-white text-sm">Admin User</p>

              <p className="text-blue-100 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
