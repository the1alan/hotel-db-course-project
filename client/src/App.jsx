import { useEffect, useMemo, useState } from "react";

const users = {
  admin: { password: "admin123", role: "admin", label: "Администратор" },
  guest: { password: "guest123", role: "guest", label: "Гость" },
};

const sections = [
  { id: "home", label: "Главная", roles: ["admin", "guest"] },
  { id: "guests", label: "Гости", roles: ["admin"] },
  { id: "roomTypes", label: "Типы комнат", roles: ["admin", "guest"] },
  { id: "rooms", label: "Комнаты", roles: ["admin", "guest"] },
  { id: "bookings", label: "Бронирования", roles: ["admin"] },
  { id: "payments", label: "Платежи", roles: ["admin"] },
  { id: "services", label: "Услуги", roles: ["admin", "guest"] },
  { id: "staff", label: "Сотрудники", roles: ["admin"] },
  { id: "bookingServices", label: "Связи услуг", roles: ["admin"] },
  { id: "references", label: "Справочники", roles: ["admin"] },
];

const apiConfig = {
  guests: {
    endpoint: "/api/guests",
    title: "Гости",
    columns: ["id", "first_name", "last_name", "phone", "email", "passport_number"],
    form: [
      { name: "first_name", label: "Имя", type: "text", required: true },
      { name: "last_name", label: "Фамилия", type: "text", required: true },
      { name: "phone", label: "Телефон", type: "text", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "passport_number", label: "Паспорт", type: "text", required: true },
    ],
  },
  roomTypes: {
    endpoint: "/api/roomTypes",
    title: "Типы комнат",
    columns: ["id", "name", "description", "base_price"],
    form: [
      { name: "name", label: "Название", type: "text", required: true },
      { name: "description", label: "Описание", type: "text" },
      { name: "base_price", label: "Базовая цена", type: "number", required: true },
    ],
  },
  rooms: {
    endpoint: "/api/rooms",
    title: "Комнаты",
    columns: ["id", "number", "floor", "status", "roomTypeId"],
    form: [
      { name: "number", label: "Номер комнаты", type: "text", required: true },
      { name: "floor", label: "Этаж", type: "number", required: true },
      { name: "status", label: "Статус", type: "text", required: true },
      { name: "roomTypeId", label: "ID типа комнаты", type: "number", required: true },
    ],
  },
  bookings: {
    endpoint: "/api/bookings",
    title: "Бронирования",
    columns: [
      "id",
      "check_in_date",
      "check_out_date",
      "status",
      "total_price",
      "guestId",
      "roomId",
    ],
    form: [
      { name: "check_in_date", label: "Дата заезда", type: "date", required: true },
      { name: "check_out_date", label: "Дата выезда", type: "date", required: true },
      { name: "status", label: "Статус", type: "text", required: true },
      { name: "total_price", label: "Итоговая стоимость", type: "number", required: true },
      { name: "guestId", label: "ID гостя", type: "number", required: true },
      { name: "roomId", label: "ID комнаты", type: "number", required: true },
    ],
  },
  payments: {
    endpoint: "/api/payments",
    title: "Платежи",
    columns: ["id", "amount", "payment_date", "method", "status", "bookingId"],
    form: [
      { name: "amount", label: "Сумма", type: "number", required: true },
      { name: "payment_date", label: "Дата платежа", type: "datetime-local" },
      { name: "method", label: "Метод", type: "text", required: true },
      { name: "status", label: "Статус", type: "text", required: true },
      { name: "bookingId", label: "ID бронирования", type: "number", required: true },
    ],
  },
  services: {
    endpoint: "/api/services",
    title: "Услуги",
    columns: ["id", "name", "description", "price"],
    form: [
      { name: "name", label: "Название", type: "text", required: true },
      { name: "description", label: "Описание", type: "text" },
      { name: "price", label: "Цена", type: "number", required: true },
    ],
  },
  staff: {
    endpoint: "/api/staff",
    title: "Сотрудники",
    columns: ["id", "first_name", "last_name", "position", "phone", "email", "salary"],
    form: [
      { name: "first_name", label: "Имя", type: "text", required: true },
      { name: "last_name", label: "Фамилия", type: "text", required: true },
      { name: "position", label: "Должность", type: "text", required: true },
      { name: "phone", label: "Телефон", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "salary", label: "Зарплата", type: "number" },
    ],
  },
  bookingServices: {
    endpoint: "/api/bookingServices",
    title: "Связь бронирований и услуг",
    columns: ["id", "quantity", "total_price", "bookingId", "serviceId"],
  },
  references: {
    endpoint: "/api/references",
    title: "Справочники",
  },
};

const entitySections = ["guests", "roomTypes", "rooms", "bookings", "payments", "services", "staff"];

const parseFormValues = (fields, formValues) => {
  const payload = {};

  fields.forEach((field) => {
    let value = formValues[field.name];

    if (value === "" || value === undefined) return;

    if (field.type === "number") {
      value = Number(value);
    }

    if (field.type === "datetime-local") {
      value = new Date(value).toISOString();
    }

    payload[field.name] = value;
  });

  return payload;
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("hotelUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [dataMap, setDataMap] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});
  const [formMap, setFormMap] = useState({});

  const isAdmin = currentUser?.role === "admin";

  const availableSections = useMemo(
    () => sections.filter((section) => section.roles.includes(currentUser?.role)),
    [currentUser]
  );

  const isEntitySection = useMemo(
    () => entitySections.includes(activeSection) || activeSection === "bookingServices",
    [activeSection]
  );

  const handleLogin = (event) => {
    event.preventDefault();
    const foundUser = users[loginForm.username.trim().toLowerCase()];

    if (!foundUser || foundUser.password !== loginForm.password) {
      setLoginError("Неверный логин или пароль");
      return;
    }

    const userData = {
      username: loginForm.username.trim().toLowerCase(),
      role: foundUser.role,
      label: foundUser.label,
    };

    localStorage.setItem("hotelUser", JSON.stringify(userData));
    setCurrentUser(userData);
    setLoginError("");
    setActiveSection("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("hotelUser");
    setCurrentUser(null);
    setLoginForm({ username: "", password: "" });
    setActiveSection("home");
    setDataMap({});
  };

  const fetchData = async (sectionId) => {
    const config = apiConfig[sectionId];
    if (!config?.endpoint) return;

    setLoading((prev) => ({ ...prev, [sectionId]: true }));
    setErrors((prev) => ({ ...prev, [sectionId]: "" }));

    try {
      const response = await fetch(config.endpoint);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Ошибка загрузки данных");
      }

      setDataMap((prev) => ({ ...prev, [sectionId]: result }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [sectionId]: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  useEffect(() => {
    if (!currentUser || activeSection === "home") return;
    fetchData(activeSection);
  }, [activeSection, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const sectionIsAllowed = availableSections.some((section) => section.id === activeSection);
    if (!sectionIsAllowed) setActiveSection("home");
  }, [activeSection, availableSections, currentUser]);

  const handleInputChange = (sectionId, fieldName, value) => {
    setFormMap((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [fieldName]: value,
      },
    }));
  };

  const handleCreate = async (sectionId) => {
    if (!isAdmin) return;

    const config = apiConfig[sectionId];
    if (!config?.form) return;

    const payload = parseFormValues(config.form, formMap[sectionId] || {});

    try {
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Ошибка создания записи");
      }

      setFormMap((prev) => ({ ...prev, [sectionId]: {} }));
      await fetchData(sectionId);
    } catch (error) {
      setErrors((prev) => ({ ...prev, [sectionId]: error.message }));
    }
  };

  const handleDelete = async (sectionId, id) => {
    if (!isAdmin) return;

    const config = apiConfig[sectionId];
    if (!config?.endpoint) return;

    try {
      const response = await fetch(`${config.endpoint}/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Ошибка удаления записи");
      }

      await fetchData(sectionId);
    } catch (error) {
      setErrors((prev) => ({ ...prev, [sectionId]: error.message }));
    }
  };

  const renderLogin = () => (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Вход в систему гостиницы</h1>
        <p>Выберите роль для работы с курсовым проектом.</p>

        <label>
          Логин
          <input
            type="text"
            value={loginForm.username}
            onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
            placeholder="admin или guest"
            required
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Введите пароль"
            required
          />
        </label>

        {loginError && <p className="error">{loginError}</p>}

        <button type="submit">Войти</button>

        <div className="demo-users">
          <strong>Данные для проверки:</strong>
          <span>Админ: admin / admin123</span>
          <span>Гость: guest / guest123</span>
        </div>
      </form>
    </div>
  );

  const renderTable = (sectionId) => {
    const config = apiConfig[sectionId];
    const rows = Array.isArray(dataMap[sectionId]) ? dataMap[sectionId] : [];

    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {config.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              {isAdmin && config.form && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={config.columns.length + (isAdmin && config.form ? 1 : 0)}>Нет данных</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {config.columns.map((column) => (
                    <td key={`${row.id}-${column}`}>{String(row[column] ?? "")}</td>
                  ))}
                  {isAdmin && config.form && (
                    <td>
                      <button className="danger" onClick={() => handleDelete(sectionId, row.id)}>
                        Удалить
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderForm = (sectionId) => {
    if (!isAdmin) return null;

    const config = apiConfig[sectionId];
    if (!config?.form) return null;

    const currentValues = formMap[sectionId] || {};

    return (
      <div className="form-card">
        <h3>Создать запись</h3>
        <div className="form-grid">
          {config.form.map((field) => (
            <label key={field.name}>
              {field.label}
              <input
                type={field.type}
                required={field.required}
                value={currentValues[field.name] || ""}
                onChange={(e) => handleInputChange(sectionId, field.name, e.target.value)}
              />
            </label>
          ))}
        </div>
        <button onClick={() => handleCreate(sectionId)}>Создать</button>
      </div>
    );
  };

  const renderReferences = () => {
    const references = dataMap.references || {};

    return (
      <div>
        <h2>Справочники</h2>
        <button onClick={() => fetchData("references")}>Обновить справочники</button>
        {errors.references && <p className="error">{errors.references}</p>}
        {loading.references && <p>Загрузка...</p>}

        {Object.entries(references).map(([key, rows]) => (
          <div key={key} className="reference-block">
            <h3>{key}</h3>
            <pre>{JSON.stringify(rows, null, 2)}</pre>
          </div>
        ))}
      </div>
    );
  };

  if (!currentUser) {
    return renderLogin();
  }

  return (
    <div className="layout">
      <header className="app-header">
        <div>
          <h1>Система управления гостиницей</h1>
          <p>Frontend на React + Vite для курсового проекта</p>
        </div>
        <div className="user-panel">
          <span>{currentUser.label}</span>
          <button type="button" onClick={handleLogout}>Выйти</button>
        </div>
      </header>

      <nav>
        {availableSections.map((section) => (
          <button
            key={section.id}
            className={activeSection === section.id ? "active" : ""}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <main>
        {activeSection === "home" && (
          <div className="home">
            <h2>Главная страница</h2>
            {isAdmin ? (
              <>
                <p>Вы вошли как администратор. Доступны просмотр, создание и удаление записей.</p>
                <ul>
                  <li>Гости</li>
                  <li>Типы комнат</li>
                  <li>Комнаты</li>
                  <li>Бронирования</li>
                  <li>Платежи</li>
                  <li>Услуги</li>
                  <li>Сотрудники</li>
                  <li>Связи услуг</li>
                  <li>Справочники</li>
                </ul>
              </>
            ) : (
              <>
                <p>Вы вошли как гость. Доступен только просмотр открытых разделов.</p>
                <ul>
                  <li>Типы комнат</li>
                  <li>Комнаты</li>
                  <li>Услуги</li>
                </ul>
              </>
            )}
          </div>
        )}

        {isEntitySection && activeSection !== "bookingServices" && (
          <div>
            <h2>{apiConfig[activeSection].title}</h2>
            <div className="actions">
              <button onClick={() => fetchData(activeSection)}>Обновить</button>
            </div>
            {errors[activeSection] && <p className="error">{errors[activeSection]}</p>}
            {renderForm(activeSection)}
            {loading[activeSection] ? <p>Загрузка...</p> : renderTable(activeSection)}
          </div>
        )}

        {activeSection === "bookingServices" && (
          <div>
            <h2>{apiConfig.bookingServices.title}</h2>
            <div className="actions">
              <button onClick={() => fetchData("bookingServices")}>Обновить</button>
            </div>
            {errors.bookingServices && <p className="error">{errors.bookingServices}</p>}
            {loading.bookingServices ? <p>Загрузка...</p> : renderTable("bookingServices")}
          </div>
        )}

        {activeSection === "references" && renderReferences()}
      </main>
    </div>
  );
}

export default App;
