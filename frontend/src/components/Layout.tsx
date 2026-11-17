import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { MenuIcon, HomeIcon } from "lucide-react";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getActiveModule = () => {
    const path = location.pathname;

    if (path === "/" || path === "/dashboard") return "Dashboard";

    if (path === "/department") return "Department";

    if (path === "/employees") return "Employees";

    if (path === "/users") return "Users";

    if (path === "/departmentsemployee") return "Department";

    if (path === "/memberrecords") return "Employees";

    return "Dashboard";
  };

  const activeModule = getActiveModule();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* MOBILE BREADCRUMB */}
      <div
        className="
        lg:hidden
        fixed
        top-0
        left-0
        right-0
        h-14
        bg-white
        border-b
        border-blue-100
        shadow-sm
        z-[999]
        flex
        items-center
        px-4
        gap-3
        "
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="
          w-9
          h-9
          bg-blue-700
          text-white
          rounded-lg
          flex
          items-center
          justify-center
          "
        >
          <MenuIcon size={20} />
        </button>

        <div
          className="
          flex
          items-center
          gap-2
          "
        >
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

      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeModule={activeModule}
      />

      {/* MAIN AREA */}
      <div
        className="
        flex-1
        flex
        flex-col
        lg:pl-64
        transition-all
        duration-300
        "
      >
        {/* DESKTOP HEADER */}
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeModule={activeModule}
        />

        {/* CONTENT */}

        <main
          className="
          flex-1
          p-4
          sm:p-6
          lg:p-8
          overflow-x-hidden
          pt-20
          lg:pt-8
          "
        >
          <div
            className="
            max-w-7xl
            mx-auto
            animate-in
            fade-in
            duration-500
            "
          >
            {/* Hide duplicate title on mobile */}
            <div
              className="
              mb-6
              hidden
              lg:block
              "
            >
              <h1
                className="
                text-2xl
                font-bold
                text-gray-900
                "
              >
                {activeModule}
              </h1>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
