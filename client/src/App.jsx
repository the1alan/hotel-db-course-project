import { useEffect, useMemo, useState } from "react";

const users = {
  admin: { password: "admin123", role: "admin", label: "Администратор" },
  guest: { password: "guest123", role: "guest", label: "Гость" },
};

const sections = [
  { id: "home", label: "Главная", icon: "🏨", roles: ["admin", "guest"] },
  { id: "guests", label: "Гости", icon: "👥", roles: ["admin"] },
  { id: "roomTypes", label: "Типы комнат", icon: "🛏️", roles: ["admin", "guest"] },
  { id: "rooms", label: "Комнаты", icon: "🚪", roles: ["admin", "guest"] },
  { id: "bookings", label: "Бронирования", icon: "📅", roles: ["admin"] },
  { id: "payments", label: "Платежи", icon: "💳", roles: ["admin"] },
  { id: "services", label: "Услуги", icon: "☕", roles: ["admin", "guest"] },
];

const apiConfig = {
  rooms: { endpoint: "/api/rooms", columns: ["id","number","floor","status","roomTypeId"] },
  guests: { endpoint: "/api/guests", columns: ["id","first_name","last_name","phone"] },
  bookings: { endpoint: "/api/bookings", columns: ["id","status","total_price"] },
  payments: { endpoint: "/api/payments", columns: ["id","amount","status"] },
  services: { endpoint: "/api/services", columns: ["id","name","price"] },
  roomTypes: { endpoint: "/api/roomTypes", columns: ["id","name","base_price"] },
};

const money = (v) =>
  new Intl.NumberFormat("ru-RU").format(Number(v || 0));

const statusClass = (s="") => {
  s = s.toLowerCase();
  if (["paid","active","available"].some(x=>s.includes(x))) return "success";
  if (["pending","booked"].some(x=>s.includes(x))) return "warning";
  if (["cancel","busy"].some(x=>s.includes(x))) return "danger";
  return "neutral";
};

export default function App(){
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem("hotelUser")));
  const [login,setLogin]=useState({u:"",p:""});
  const [data,setData]=useState({});
  const [section,setSection]=useState("home");
  const [search,setSearch]=useState("");

  const isAdmin = user?.role==="admin";

  const dashboard = useMemo(()=>{
    const rooms=data.rooms||[];
    const guests=data.guests||[];
    const bookings=data.bookings||[];
    const payments=data.payments||[];

    return {
      rooms: rooms.length,
      guests: guests.length,
      bookings: bookings.length,
      revenue: payments.reduce((s,x)=>s+Number(x.amount||0),0)
    }
  },[data]);

  const loginHandler=(e)=>{
    e.preventDefault();
    const u=users[login.u];
    if(!u||u.password!==login.p)return alert("Ошибка");
    const obj={role:u.role,label:u.label};
    localStorage.setItem("hotelUser",JSON.stringify(obj));
    setUser(obj);
  };

  const logout=()=>{
    localStorage.removeItem("hotelUser");
    setUser(null);
  };

  const fetchData=async(name)=>{
    const res=await fetch(apiConfig[name].endpoint);
    const json=await res.json();
    setData(p=>({...p,[name]:json}));
  };

  useEffect(()=>{
    if(!user)return;
    Object.keys(apiConfig).forEach(fetchData);
  },[user]);

  const renderTable=(name)=>{
    const rows=data[name]||[];
    const filtered = rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));

    return (
      <>
        <input placeholder="поиск..." onChange={e=>setSearch(e.target.value)} />
        <table>
          <thead>
            <tr>{apiConfig[name].columns.map(c=><th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(r=>(
              <tr key={r.id}>
                {apiConfig[name].columns.map(c=>(
                  <td key={c}>
                    {c==="status"
                      ? <span className={statusClass(r[c])}>{r[c]}</span>
                      : c.includes("price")||c==="amount"
                        ? money(r[c])+" ₽"
                        : String(r[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
  };

  if(!user){
    return(
      <form onSubmit={loginHandler}>
        <h2>Вход</h2>
        <input placeholder="login" onChange={e=>setLogin({...login,u:e.target.value})}/>
        <input placeholder="pass" onChange={e=>setLogin({...login,p:e.target.value})}/>
        <button>Войти</button>
      </form>
    )
  }

  return(
    <div>
      <h1>Hotel Admin</h1>
      <button onClick={logout}>Выйти</button>

      <nav>
        {sections.filter(s=>s.roles.includes(user.role)).map(s=>(
          <button key={s.id} onClick={()=>setSection(s.id)}>{s.icon} {s.label}</button>
        ))}
      </nav>

      {section==="home" && (
        <div>
          <h2>Дашборд</h2>
          <p>Комнаты: {dashboard.rooms}</p>
          <p>Гости: {dashboard.guests}</p>
          <p>Бронирования: {dashboard.bookings}</p>
          <p>Доход: {money(dashboard.revenue)} ₽</p>
        </div>
      )}

      {section!=="home" && renderTable(section)}
    </div>
  )
}