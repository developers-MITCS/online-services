import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPinIcon,
  SearchIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  CheckIcon,
} from "lucide-react";
import logo1 from "../assets/bcdlogo.png";
import logo2 from "../assets/mitcslogo.png";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

// ====== CONFIG ======
// Vite:   VITE_API_BASE_URL=http://localhost:5000
// CRA:    use process.env.REACT_APP_API_BASE_URL instead
const BASE_URL = "https://public-api-new.bacolodcity.gov.ph";
const TRACK_URL = "https://trackp.bacolodcity.gov.ph/ptos/";

// "&amp;" -> "&" (titles come from the DB HTML-encoded)
const decodeHtml = (s) => {
  if (!s) return "";
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value.trim();
};

const formatDate = (d) => {
  if (!d) return "No update yet";
  const dt = new Date(d);
  return isNaN(dt)
    ? "No update yet"
    : "Updated " +
        dt.toLocaleDateString("en-PH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
};

const openProject = (uuid) => {
  window.open(
    `${TRACK_URL}?uuid=${encodeURIComponent(uuid)}`,
    "_blank",
    "noopener,noreferrer",
  );
};

// Searchable barangay dropdown
function BarangayCombobox({ value, onChange, options, total }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  // close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const list = options.filter(([name]) =>
    name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const select = (v) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  return (
    <div
      ref={ref}
      className="relative w-full sm:w-56"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
        w-full flex items-center justify-between gap-2
        px-3 py-2 text-sm
        border rounded-lg bg-white
        hover:border-orange-400
        focus:outline-none focus:ring-2 focus:ring-orange-400
        "
      >
        <span className="flex items-center gap-2 truncate">
          <MapPinIcon className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="truncate">{value || "All barangays"}</span>
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full min-w-[14rem] sm:right-0 bg-white border rounded-lg shadow-lg">
          <div className="p-2 border-b">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search barangay…"
              className="
              w-full px-3 py-1.5 text-sm
              border rounded-md
              focus:outline-none focus:ring-2 focus:ring-orange-400
              "
            />
          </div>

          <ul className="max-h-60 overflow-auto py-1">
            {"all barangays".includes(query.trim().toLowerCase()) && (
              <li>
                <button
                  type="button"
                  onClick={() => select("")}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-orange-50"
                >
                  <span className="flex items-center gap-2">
                    {value === "" && (
                      <CheckIcon className="w-4 h-4 text-orange-500" />
                    )}
                    All barangays
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    {total}
                  </span>
                </button>
              </li>
            )}

            {list.map(([name, count]) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => select(name)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-orange-50"
                >
                  <span className="flex items-center gap-2 truncate">
                    {value === name && (
                      <CheckIcon className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <span className="truncate">{name}</span>
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    {count}
                  </span>
                </button>
              </li>
            ))}

            {list.length === 0 &&
              !"all barangays".includes(query.trim().toLowerCase()) && (
                <li className="px-3 py-3 text-sm text-gray-500 text-center">
                  No barangay found
                </li>
              )}
          </ul>
        </div>
      )}
    </div>
  );
}

export function DashboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [barangay, setBarangay] = useState("");

  // ====== FETCH FROM API ======
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${BASE_URL}/ptos`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setData(Array.isArray(json) ? json : json.data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(
            "Unable to load projects right now. Please try again later.",
          );
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  // active only
  const projects = useMemo(
    () => data.filter((p) => String(p.status).toLowerCase() === "active"),
    [data],
  );

  const barangayCounts = useMemo(() => {
    const counts = {};
    projects.forEach((p) => {
      counts[p.barangay] = (counts[p.barangay] || 0) + 1;
    });
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  }, [projects]);

  const filtered = projects
    .filter((p) => {
      if (barangay && p.barangay !== barangay) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return [
        p.proj_title,
        p.contractor,
        p.proj_loc,
        p.barangay,
        p.acardno,
      ].some((v) => decodeHtml(v).toLowerCase().includes(q));
    })
    // order by percentage: highest first, no progress last
    .sort((a, b) => {
      const pa = a.percentage == null ? -1 : Number(a.percentage);
      const pb = b.percentage == null ? -1 : Number(b.percentage);
      return pb - pa;
    });

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div
        className="
        rounded-xl
        bg-gradient-to-r from-orange-500 to-orange-400
        text-white
        text-center
        px-6 py-8
        border-b-4 border-blue-800
        "
      >
        <h1 className="text-2xl font-bold">Infrastructure Projects</h1>
        <p className="text-white/90">
          Track ongoing projects in your community
        </p>
      </div>

      <div>
        {/* Projects */}
        <Card>
          <div
            className="
            px-6 py-4
            border-b
            flex flex-wrap items-center justify-between gap-3
            "
          >
            <h3 className="text-lg font-semibold">
              Active Projects{" "}
              <span className="text-sm font-normal text-gray-500">
                ({filtered.length})
              </span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <BarangayCombobox
                value={barangay}
                onChange={setBarangay}
                options={barangayCounts}
                total={projects.length}
              />

              <div className="relative w-full sm:w-72">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search project, contractor, location…"
                  className="
                w-full pl-9 pr-3 py-2
                text-sm
                border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-orange-400
                "
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-gray-500">
              Loading projects…
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-center text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">
              No active projects found.
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((project) => {
                const pct =
                  project.percentage == null
                    ? null
                    : Number(project.percentage);
                const title = decodeHtml(project.proj_title);

                return (
                  <li
                    key={project.acardmstr_id}
                    className="px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between gap-3">
                      <div className="flex gap-3 min-w-0">
                        <div
                          className="
                          w-8 h-8 shrink-0
                          rounded-full
                          bg-blue-100
                          flex items-center justify-center
                          text-blue-700
                          font-bold
                          "
                        >
                          {title.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold">{title}</p>

                          <p className="text-xs text-gray-500">
                            {project.acardno} · {decodeHtml(project.proj_loc)},{" "}
                            {project.barangay}
                          </p>

                          <p className="text-xs text-gray-500">
                            {project.contractor} ·{" "}
                            {formatDate(project.updated_date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge
                          variant={
                            pct == null
                              ? "default"
                              : pct >= 75
                                ? "success"
                                : "warning"
                          }
                        >
                          {pct == null ? "No progress yet" : `${pct}%`}
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openProject(project.enc_acardmstr_id)}
                        >
                          View more
                          <ExternalLinkIcon className="w-3.5 h-3.5 ml-2" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 ml-11 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-300"
                        style={{
                          width: `${pct == null ? 0 : Math.min(pct, 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
      <footer className="py-5 text-center text-sm text-gray-500">
        <div className="flex justify-center items-center gap-5">
          <img
            src={logo1}
            alt="City Logo"
            className="h-14 w-14 object-contain"
          />

          <div className="text-center">
            <h3 className="font-semibold text-gray-700">
              City Government of Bacolod
            </h3>

            <p className="text-xs text-gray-500">
              Management Information Technology and Computer Services
            </p>

            <p className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} City Government of Bacolod. All
              Rights Reserved.
            </p>
          </div>

          <img
            src={logo2}
            alt="MITCS Logo"
            className="h-14 w-14 object-contain"
          />
        </div>
      </footer>
    </div>
  );
}
