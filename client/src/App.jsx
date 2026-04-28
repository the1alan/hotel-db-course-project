import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const sections = [
  ["dashboard", "Dashboard"],
  ["roomTypes", "Типы номеров"],
  ["rooms", "Номера"],
  ["guests", "Гости"],
  ["bookings", "Бронирования"],
  ["payments", "Оплаты"],
  ["services", "Услуги"],
  ["staff", "Сотрудники"],
  ["reports", "Отчёты"],
  ["references", "Справочники"],
];

const resources = {
  roomTypes: { endpoint: "/api/room-types", columns: ["id", "name", "description", "base_price", "capacity"], form: ["name", "description", "base_price", "capacity"] },
  rooms: { endpoint: "/api/rooms", columns: ["id", "number", "floor", "status", "roomTypeId"], form: ["number", "floor", "status", "roomTypeId"] },
  guests: { endpoint: "/api/guests", columns: ["id", "first_name", "last_name", "phone", "email", "passport_number"], form: ["first_name", "last_name", "phone", "email", "passport_number"] },
  bookings: { endpoint: "/api/bookings", columns: ["id", "guestId", "roomId", "check_in_date", "check_out_date", "status", "total_price"], form: ["guestId", "roomId", "check_in_date", "check_out_date", "status", "total_price"] },
  payments: { endpoint: "/api/payments", columns: ["id", "bookingId", "amount", "payment_date", "method", "status"], form: ["bookingId", "amount", "payment_date", "method", "status"] },
  services: { endpoint: "/api/services", columns: ["id", "name", "description", "price"], form: ["name", "description", "price"] },
  staff: { endpoint: "/api/staff", columns: ["id", "first_name", "last_name", "position", "email", "role"], form: ["first_name", "last_name", "position", "email", "phone", "salary", "role", "password_hash"] },
};

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
}

function App() {
  const [section, setSection] = useState("dashboard");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({});
  const [reportPeriod, setReportPeriod] = useState({ from: "2026-04-01", to: "2026-05-01" });
  const [reports, setReports] = useState({});

  const loadResource = async (key) => {
    try {
      setError("");
      const data = await apiFetch(resources[key].endpoint);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
      setRows([]);
    }
  };

  useEffect(() => {
    if (resources[section]) loadResource(section);
    if (section === "references") {
      apiFetch("/api/references").then(setReports).catch((e) => setError(e.message));
    }
  }, [section]);

  const createItem = async () => {
    try {
      setError("");
      await apiFetch(resources[section].endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({});
      loadResource(section);
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      setError("");
      await apiFetch(`${resources[section].endpoint}/${id}`, { method: "DELETE" });
      loadResource(section);
    } catch (e) {
      setError(e.message);
    }
  };

  const loadReports = async () => {
    try {
      setError("");
      const [occupancy, revenue, popularRoomTypes, debts] = await Promise.all([
        apiFetch(`/api/reports/occupancy?from=${reportPeriod.from}&to=${reportPeriod.to}`),
        apiFetch(`/api/reports/revenue?from=${reportPeriod.from}&to=${reportPeriod.to}`),
        apiFetch(`/api/reports/popular-room-types?from=${reportPeriod.from}&to=${reportPeriod.to}`),
        apiFetch(`/api/reports/debts`),
      ]);
      setReports({ occupancy, revenue, popularRoomTypes, debts });
    } catch (e) {
      setError(`${e.message}. Для отчётов нужен JWT manager/admin в Authorization.`);
    }
  };

  return (
    <div className="layout">
      <h1>Система управления гостиницей</h1>
      <p>API: {API_BASE}</p>
      <nav>
        {sections.map(([id, label]) => (
          <button key={id} className={section === id ? "active" : ""} onClick={() => setSection(id)}>{label}</button>
        ))}
      </nav>

      {error && <p className="error">{error}</p>}

      {section === "dashboard" && (
        <div>
          <h2>Главная</h2>
          <p>Выберите раздел. Если API недоступен — появится понятная ошибка.</p>
        </div>
      )}

      {resources[section] && (
        <div>
          <h2>{sections.find((s) => s[0] === section)?.[1]}</h2>
          <div className="form-grid">
            {resources[section].form.map((field) => (
              <input
                key={field}
                placeholder={field}
                value={form[field] || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
              />
            ))}
          </div>
          <button onClick={createItem}>Создать</button>
          <table>
            <thead>
              <tr>
                {resources[section].columns.map((c) => <th key={c}>{c}</th>)}
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {resources[section].columns.map((c) => <td key={c}>{String(r[c] ?? "")}</td>)}
                  <td><button className="danger" onClick={() => deleteItem(r.id)}>Удалить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === "reports" && (
        <div>
          <h2>Отчёты</h2>
          <div className="form-grid">
            <input type="date" value={reportPeriod.from} onChange={(e) => setReportPeriod((p) => ({ ...p, from: e.target.value }))} />
            <input type="date" value={reportPeriod.to} onChange={(e) => setReportPeriod((p) => ({ ...p, to: e.target.value }))} />
          </div>
          <button onClick={loadReports}>Загрузить отчёты</button>
          <pre>{JSON.stringify(reports, null, 2)}</pre>
        </div>
      )}

      {section === "references" && (
        <div>
          <h2>Справочники</h2>
          <pre>{JSON.stringify(reports, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
