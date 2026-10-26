import { useEffect, useMemo, useState } from "react";

const initialDoctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", clinic: "City Heart Clinic", location: "Kabul", gender: "Female", language: "English, Dari", rating: 4.9, fee: 800, initials: "SJ", color: "rose" },
  { id: 2, name: "Dr. Ahmad Rahimi", specialty: "General Physician", clinic: "Central Medical Center", location: "Kabul", gender: "Male", language: "Dari, Pashto", rating: 4.8, fee: 500, initials: "AR", color: "blue" },
  { id: 3, name: "Dr. Laila Noori", specialty: "Pediatrician", clinic: "Children's Care Clinic", location: "Kabul", gender: "Female", language: "Dari, English", rating: 4.7, fee: 600, initials: "LN", color: "purple" },
  { id: 4, name: "Dr. Omar Khan", specialty: "Dermatologist", clinic: "Healthy Skin Center", location: "Herat", gender: "Male", language: "Dari, Pashto, English", rating: 4.6, fee: 700, initials: "OK", color: "green" }
];
const initialProducts = [
  { id: 1, name: "Fresh Food Basket", category: "Food", price: 5, unit: "basket", emoji: "🥗", description: "Fresh daily essentials" },
  { id: 2, name: "Healthy Snack Pack", category: "Food", price: 10, unit: "pack", emoji: "🍎", description: "Nutritious snack selection" },
  { id: 3, name: "Family Care Kit", category: "Health", price: 15, unit: "kit", emoji: "🩺", description: "Everyday wellness items" },
  { id: 4, name: "Wellness Pack", category: "Health", price: 20, unit: "pack", emoji: "💚", description: "Simple wellness essentials" }
];
const initialMedicines = [
  { id: 1, name: "Paracetamol", category: "Pain relief", strength: "500 mg", price: 40, stock: "Available", emoji: "💊" },
  { id: 2, name: "Vitamin C", category: "Vitamins", strength: "500 mg", price: 120, stock: "Available", emoji: "🟠" },
  { id: 3, name: "Antiseptic Cream", category: "First aid", strength: "30 g", price: 90, stock: "Available", emoji: "🧴" },
  { id: 4, name: "Oral Rehydration Salts", category: "Rehydration", strength: "1 sachet", price: 25, stock: "Available", emoji: "🧃" }
];

const routeTitles = {
  "/": "Sign In", "/signup": "Sign Up", "/dashboard": "Dashboard",
  "/searchdoctor": "Find Doctor", "/findclinic": "Find Clinic",
  "/marketplace": "Marketplace", "/pharmacy": "Pharmacy",
  "/appointments": "Appointments", "/chat": "Messages",
  "/dependents": "My Dependents", "/account": "My Account", "/settings": "Settings"
};

function readRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/index.html") return "/";
  return routeTitles[path] ? path : "/dashboard";
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [doctors, setDoctors] = useState(initialDoctors);
  const [products] = useState(initialProducts);
  const [medicines] = useState(initialMedicines);
  const [appointments, setAppointments] = useState(() => JSON.parse(localStorage.getItem("mph-appointments") || "[]"));
  const [dependents, setDependents] = useState(() => JSON.parse(localStorage.getItem("mph-dependents") || "[]"));
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem("mph-profile") || '{"name":"Shabana Dorandish","email":"shabana@example.com","phone":"","location":"Kabul"}'));
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem("mph-settings") || '{"notifications":true,"language":"English","theme":"Light"}'));

  useEffect(() => {
    const onPop = () => { setRoute(readRoute()); setMobileMenu(false); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => { document.title = `${routeTitles[route] || "MyPatientHUB"} | MyPatientHUB`; }, [route]);

  function go(path) {
    window.history.pushState({}, "", path);
    setRoute(path);
    setSearch("");
    setMobileMenu(false);
    setNotice("");
    window.scrollTo(0, 0);
  }
  function flash(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }
  function saveAppointments(next) {
    setAppointments(next);
    localStorage.setItem("mph-appointments", JSON.stringify(next));
  }
  function saveDependents(next) {
    setDependents(next);
    localStorage.setItem("mph-dependents", JSON.stringify(next));
  }
  function saveProfile(next) {
    setProfile(next);
    localStorage.setItem("mph-profile", JSON.stringify(next));
    flash("Account details saved on this device.");
  }
  function saveSettings(next) {
    setSettings(next);
    localStorage.setItem("mph-settings", JSON.stringify(next));
    flash("Settings saved.");
  }

  if (route === "/" || route === "/signup") {
    return <AuthPage signup={route === "/signup"} go={go} flash={flash} />;
  }

  const nav = [
    ["Dashboard", "/dashboard", "▦"], ["Appointments", "/appointments", "▣"],
    ["Find Doctor", "/searchdoctor", "⚕"], ["Find Clinic", "/findclinic", "⌂"],
    ["Marketplace", "/marketplace", "🛍"], ["Pharmacy", "/pharmacy", "✚"],
    ["Messages", "/chat", "✉"], ["My Dependents", "/dependents", "♧"],
    ["My Account", "/account", "◉"], ["Settings", "/settings", "⚙"]
  ];

  let page;
  switch (route) {
    case "/dashboard": page = <Dashboard go={go} appointments={appointments} dependents={dependents} profile={profile} />; break;
    case "/searchdoctor": page = <DoctorPage search={search} setSearch={setSearch} doctors={doctors} setDoctors={setDoctors} appointments={appointments} saveAppointments={saveAppointments} flash={flash} />; break;
    case "/findclinic": page = <ClinicPage search={search} setSearch={setSearch} go={go} />; break;
    case "/marketplace": page = <Marketplace products={products} search={search} setSearch={setSearch} flash={flash} />; break;
    case "/pharmacy": page = <Pharmacy medicines={medicines} search={search} setSearch={setSearch} flash={flash} />; break;
    case "/appointments": page = <Appointments appointments={appointments} saveAppointments={saveAppointments} />; break;
    case "/chat": page = <Messages flash={flash} />; break;
    case "/dependents": page = <Dependents dependents={dependents} saveDependents={saveDependents} />; break;
    case "/account": page = <Account profile={profile} saveProfile={saveProfile} />; break;
    case "/settings": page = <Settings settings={settings} saveSettings={saveSettings} />; break;
    default: page = <Dashboard go={go} appointments={appointments} dependents={dependents} profile={profile} />;
  }

  return (
    <div className="app-shell">
      {mobileMenu && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileMenu(false)} />}
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <button className="brand" onClick={() => go("/dashboard")}><span className="brand-mark">+</span><span>MyPatient<span className="brand-light">HUB</span><small>SMART HEALTHCARE</small></span></button>
        <div className="side-label">MAIN MENU</div>
        <nav>{nav.map(([label, path, icon]) => <button key={path} className={`nav-item ${route === path ? "active" : ""}`} onClick={() => go(path)}><span className="nav-icon">{icon}</span><span>{label}</span>{path === "/chat" && <span className="nav-count">2</span>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="help-card"><span className="help-icon">?</span><b>Need help?</b><p>We're here to support you.</p><button onClick={() => flash("Support contact: support@mypatienthub.example")}>Contact support</button></div><button className="nav-item logout" onClick={() => go("/")}>↪ <span>Sign Out</span></button></div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">☰</button>
          <div className="crumb"><span>Pages</span><b>/</b><strong>{routeTitles[route]}</strong></div>
          <div className="top-actions">
            <label className="top-search"><span>⌕</span><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></label>
            <button className="icon-button" title="Notifications" onClick={() => flash("You're all caught up!")}>♧<i /></button>
            <button className="profile-button" onClick={() => go("/account")}><span className="avatar mini">{(profile.name || "S").slice(0,1).toUpperCase()}</span><span className="profile-name">{profile.name || "My Account"}</span><span>⌄</span></button>
          </div>
        </header>
        <main className="page-content">
          {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}
          {page}
          <footer className="app-footer"><span>© {new Date().getFullYear()} MyPatientHUB</span><span>Healthcare, made simpler.</span></footer>
        </main>
      </div>
    </div>
  );
}

function AuthPage({ signup, go, flash }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (signup && !name.trim())) {
      flash("Please fill in all required fields.");
      return;
    }
    flash(signup ? "Demo account created on this device." : "Demo sign-in successful.");
    go("/dashboard");
  }
  return <div className="auth-page">
    <section className="auth-welcome"><div className="auth-logo"><span className="brand-mark">+</span> MyPatient<span>HUB</span></div><div className="welcome-copy"><div className="eyebrow">YOUR HEALTH, CONNECTED</div><h1>{signup ? "Join MyPatientHUB" : "Welcome to MyPatientHUB!"}</h1><p>We provide smart healthcare services in your hands.</p><div className="health-illustration"><div className="health-circle">✚</div><span className="float-pill">♡</span><span className="float-plus">+</span><span className="float-cross">✚</span></div><div className="welcome-foot">A simpler way to manage your healthcare.</div></div></section>
    <section className="auth-panel"><div className="auth-card"><div className="auth-heading"><div className="eyebrow">WELCOME BACK</div><h2>{signup ? "Create your account" : "Sign in to MyPatientHUB"}</h2><p>{signup ? "Enter your details to get started." : "Enter your details to continue."}</p></div><div className="social-row"><button onClick={() => flash("Social sign-in is a demo only.")}><b className="facebook-letter">f</b> Facebook</button><button onClick={() => flash("Social sign-in is a demo only.")}><b className="google-letter">G</b> Google</button></div><div className="auth-divider"><span>or continue with email</span></div><form onSubmit={submit} className="auth-form">{signup && <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" /></label>}<label>Email or phone number<input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email or Phone number" autoComplete="username" /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Please enter your password" autoComplete={signup ? "new-password" : "current-password"} /></label>{!signup && <div className="auth-options"><label className="check-label"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me</label><button type="button" className="text-button" onClick={() => flash("Password recovery requires an email service to be connected.")}>Forgot password?</button></div>}<button className="primary-btn full-btn">{signup ? "CREATE ACCOUNT" : "SIGN IN"} <span>→</span></button></form><p className="auth-switch">{signup ? "Already have an account?" : "Don't have an account?"} <button onClick={() => go(signup ? "/" : "/signup")}>{signup ? "Sign in" : "Sign up"}</button></p><p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p></div><footer className="auth-footer"><span>Google Play Store APP</span><span>App Store APP</span><span>About Us</span><span>Our Blog</span></footer></section>
  </div>;
}

function PageHeading({ eyebrow = "OVERVIEW", title, subtitle, action, onAction }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action && <button className="primary-btn" onClick={onAction}>{action}</button>}</div>;
}
function StatCard({ icon, label, value, note, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>;
}
function Dashboard({ go, appointments, dependents, profile }) {
  const next = appointments[0];
  return <><PageHeading eyebrow="OVERVIEW" title={`Good day, ${(profile.name || "there").split(" ")[0]} 👋`} subtitle="Here is what's happening with your health today." action="＋ Book an appointment" onAction={() => go("/searchdoctor")} />
    <div className="stats-grid"><StatCard icon="▣" label="Appointments" value={appointments.length} note="Your saved bookings" tone="pink"/><StatCard icon="⚕" label="Doctors" value="24+" note="Available in directory" tone="blue"/><StatCard icon="♧" label="Dependents" value={dependents.length} note="Family profiles" tone="purple"/><StatCard icon="♥" label="Health score" value="Good" note="Keep taking care" tone="green"/></div>
    <div className="dashboard-grid"><section className="panel welcome-panel"><div><div className="eyebrow">YOUR HEALTH JOURNEY</div><h2>Care that works around you.</h2><p>Find trusted doctors, discover clinics and keep your family's health details in one place.</p><button className="primary-btn" onClick={() => go("/searchdoctor")}>Find a doctor <span>→</span></button></div><div className="welcome-art"><div className="art-ring">✚</div><span className="art-heart">♡</span><span className="art-dot">+</span></div></section>
    <section className="panel"><div className="panel-head"><div><h3>Quick actions</h3><p>Common tasks at a glance</p></div></div><div className="quick-actions"><button onClick={() => go("/searchdoctor")}><span className="quick-icon pink">⚕</span><span><b>Find a doctor</b><small>Browse specialists</small></span><i>→</i></button><button onClick={() => go("/findclinic")}><span className="quick-icon blue">⌂</span><span><b>Find a clinic</b><small>Care near you</small></span><i>→</i></button><button onClick={() => go("/pharmacy")}><span className="quick-icon green">✚</span><span><b>Visit pharmacy</b><small>Browse medicines</small></span><i>→</i></button></div></section>
    <section className="panel"><div className="panel-head"><div><h3>Upcoming appointments</h3><p>Your latest saved appointments</p></div><button className="text-button" onClick={() => go("/appointments")}>View all →</button></div>{next ? <AppointmentRow item={next}/> : <EmptyState icon="▣" title="No appointments yet" text="Your bookings will appear here." action="Find a doctor" onAction={() => go("/searchdoctor")}/>}</section>
    <section className="panel health-tip"><div className="tip-icon">✦</div><div><div className="eyebrow">WELLNESS TIP</div><h3>Small steps matter</h3><p>Drink water regularly, stay active when you can, and arrange routine check-ups.</p></div></section></div>
  </>;
}
function EmptyState({ icon = "○", title, text, action, onAction }) {
  return <div className="empty-state"><div className="empty-icon">{icon}</div><b>{title}</b><p>{text}</p>{action && <button className="text-button" onClick={onAction}>{action} →</button>}</div>;
}
function DoctorPage({ search, setSearch, doctors, setDoctors, appointments, saveAppointments, flash }) {
  const [specialty, setSpecialty] = useState("All specialties");
  const [gender, setGender] = useState("Any gender");
  const [view, setView] = useState("list");
  const [bookDoctor, setBookDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [sort, setSort] = useState("Recommended");
  const specialties = ["All specialties", ...new Set(doctors.map(d => d.specialty))];
  const filtered = useMemo(() => doctors.filter(d => (specialty === "All specialties" || d.specialty === specialty) && (gender === "Any gender" || d.gender === gender) && `${d.name} ${d.specialty} ${d.clinic} ${d.location} ${d.language}`.toLowerCase().includes(search.toLowerCase())).sort((a,b) => sort === "Highest rated" ? b.rating-a.rating : 0), [doctors, specialty, gender, search, sort]);
  function book(e) {
    e.preventDefault();
    if (!date) return flash("Please select an appointment date.");
    const next = [{ id: Date.now(), doctor: bookDoctor.name, specialty: bookDoctor.specialty, date, time, clinic: bookDoctor.clinic, status: "Upcoming" }, ...appointments];
    saveAppointments(next);
    setBookDoctor(null);
    setDate("");
    flash("Appointment saved on this device.");
  }
  return <><PageHeading eyebrow="CARE DIRECTORY" title="Find a Doctor" subtitle="Discover trusted healthcare professionals for your needs."/><div className="search-panel panel"><div className="large-search"><span>⌕</span><input placeholder="Search doctor, specialty, clinic or location..." value={search} onChange={e => setSearch(e.target.value)}/><button onClick={() => setSearch("")}>Clear</button></div><div className="filter-row"><label>Specialty<select value={specialty} onChange={e => setSpecialty(e.target.value)}>{specialties.map(s => <option key={s}>{s}</option>)}</select></label><label>Doctor gender<select value={gender} onChange={e => setGender(e.target.value)}><option>Any gender</option><option>Female</option><option>Male</option></select></label><label>Sort by<select value={sort} onChange={e => setSort(e.target.value)}><option>Recommended</option><option>Highest rated</option></select></label><div className="view-toggle"><button className={view==="list"?"selected":""} onClick={() => setView("list")}>☷ List</button><button className={view==="map"?"selected":""} onClick={() => setView("map")}>⌖ Map</button></div></div></div><div className="results-heading"><b>{filtered.length} doctors found</b><span>Showing healthcare professionals</span></div>{view==="map" && <div className="map-placeholder"><div className="map-grid"></div><span className="map-pin pin-one">⚕</span><span className="map-pin pin-two">⚕</span><span className="map-pin pin-three">⚕</span><div className="map-caption">Map preview · Connect a map provider for live locations</div></div>}<div className="doctor-list">{filtered.map(d => <article className="doctor-card panel" key={d.id}><div className={`doctor-avatar ${d.color}`}>{d.initials}<span className="verified">✓</span></div><div className="doctor-info"><div className="doctor-name-line"><h3>{d.name}</h3><span className="rating">★ {d.rating}</span></div><div className="doctor-specialty">{d.specialty}</div><p>⌂ {d.clinic}</p><div className="doctor-meta"><span>⌖ {d.location}</span><span>◉ {d.gender}</span><span>◎ {d.language}</span></div><div className="doctor-bottom"><span>Consultation fee <b>{d.fee} AFN</b></span><button className="primary-btn" onClick={() => setBookDoctor(d)}>Book appointment →</button></div></div></article>)}{!filtered.length && <div className="panel"><EmptyState icon="⚕" title="No doctors found" text="Try another name, specialty or filter."/></div>}</div>
    {bookDoctor && <div className="modal-backdrop" onClick={() => setBookDoctor(null)}><form className="modal-card" onSubmit={book} onClick={e => e.stopPropagation()}><button type="button" className="modal-close" onClick={() => setBookDoctor(null)}>×</button><div className="eyebrow">BOOK A VISIT</div><h2>Appointment with {bookDoctor.name}</h2><p>{bookDoctor.specialty} · {bookDoctor.clinic}</p><label>Choose date<input required type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e => setDate(e.target.value)}/></label><label>Choose time<select value={time} onChange={e => setTime(e.target.value)}>{["09:00","10:00","11:00","13:00","14:00","15:00"].map(t => <option key={t}>{t}</option>)}</select></label><button className="primary-btn full-btn">Confirm appointment</button><small className="demo-note">Demo booking only. No clinic is contacted.</small></form></div>}
  </>;
}
function ClinicPage({ search, setSearch, go }) {
  const clinics = [
    { name:"Central Medical Center", type:"General healthcare", location:"Kabul", doctors:12, hours:"8:00 AM – 6:00 PM", initials:"CM" },
    { name:"City Heart Clinic", type:"Cardiology", location:"Kabul", doctors:5, hours:"9:00 AM – 5:00 PM", initials:"CH" },
    { name:"Children's Care Clinic", type:"Pediatrics", location:"Kabul", doctors:7, hours:"8:30 AM – 4:30 PM", initials:"CC" },
    { name:"Herat Family Clinic", type:"Family medicine", location:"Herat", doctors:9, hours:"8:00 AM – 5:00 PM", initials:"HF" }
  ];
  const list = clinics.filter(c => `${c.name} ${c.type} ${c.location}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageHeading eyebrow="CARE DIRECTORY" title="Find a Clinic" subtitle="Explore clinics and healthcare centers around you."/><div className="panel large-search clinic-search"><span>⌕</span><input placeholder="Search clinic, service or city..." value={search} onChange={e => setSearch(e.target.value)}/><button onClick={() => setSearch("")}>Clear</button></div><div className="results-heading"><b>{list.length} clinics found</b><span>Sample directory data</span></div><div className="clinic-grid">{list.map(c => <article className="clinic-card panel" key={c.name}><div className="clinic-banner"><span className="clinic-symbol">✚</span><span className="clinic-open">● Open hours listed</span></div><div className="clinic-body"><div className="clinic-avatar">{c.initials}</div><h3>{c.name}</h3><p>{c.type}</p><div className="clinic-detail">⌖ {c.location}</div><div className="clinic-detail">⚕ {c.doctors} doctors listed</div><div className="clinic-detail">◷ {c.hours}</div><button className="outline-btn full-btn" onClick={() => go("/searchdoctor")}>View doctors →</button></div></article>)}</div>{!list.length && <div className="panel"><EmptyState title="No clinics found" text="Try another search."/></div>}</>;
}
function Marketplace({ products, search, setSearch, flash }) {
  const [category, setCategory] = useState("All");
  const list = products.filter(p => (category === "All" || p.category === category) && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageHeading eyebrow="HEALTH & WELLNESS" title="Marketplace" subtitle="Discover useful products for everyday wellbeing." action="View cart (0)" onAction={() => flash("Your demo cart is empty.")}/><div className="panel large-search clinic-search"><span>⌕</span><input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}/><button onClick={() => setSearch("")}>Clear</button></div><div className="category-row">{["All","Food","Health"].map(c => <button key={c} className={category===c?"category-active":""} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="product-grid">{list.map(p => <article className="product-card panel" key={p.id}><div className={`product-art product-art-${p.id}`}><span>{p.emoji}</span><small>{p.category}</small></div><div className="product-info"><h3>{p.name}</h3><p>{p.description}</p><div className="product-buy"><div><strong>{p.price} RM</strong><small>per {p.unit}</small></div><button className="primary-btn" onClick={() => flash(`${p.name} added to demo cart.`)}>Add +</button></div></div></article>)}</div>{!list.length && <div className="panel"><EmptyState title="No products found" text="Try a different search or category."/></div>}<div className="panel table-panel"><div className="panel-head"><div><h3>Marketplace items</h3><p>Product overview</p></div></div><div className="table-scroll"><table><thead><tr><th>Product</th><th>Category</th><th>Unit</th><th>Price</th><th>Action</th></tr></thead><tbody>{list.map(p => <tr key={p.id}><td>{p.emoji} {p.name}</td><td>{p.category}</td><td>{p.unit}</td><td>{p.price} RM</td><td><button className="text-button" onClick={() => flash(`${p.name} selected.`)}>Select</button></td></tr>)}</tbody></table></div></div></>;
}
function Pharmacy({ medicines, search, setSearch, flash }) {
  const list = medicines.filter(m => `${m.name} ${m.category} ${m.strength}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageHeading eyebrow="MEDICINE DIRECTORY" title="Pharmacy" subtitle="Browse sample pharmacy products and availability."/><div className="notice-banner"><span>ⓘ</span><div><b>Important medicine safety note</b><p>This is a demo catalogue, not medical advice. Ask a qualified pharmacist or clinician before using medication.</p></div></div><div className="panel large-search clinic-search"><span>⌕</span><input placeholder="Search medicine or category..." value={search} onChange={e => setSearch(e.target.value)}/><button onClick={() => setSearch("")}>Clear</button></div><div className="medicine-grid">{list.map(m => <article className="medicine-card panel" key={m.id}><div className="medicine-emoji">{m.emoji}</div><div className="medicine-copy"><span className="stock-pill">{m.stock}</span><h3>{m.name}</h3><p>{m.category} · {m.strength}</p><div className="medicine-price">{m.price} AFN</div><button className="outline-btn full-btn" onClick={() => flash("Demo only: please contact a licensed pharmacy for availability.")}>Check availability</button></div></article>)}</div>{!list.length && <div className="panel"><EmptyState title="No medicines found" text="Try another search."/></div>}<div className="panel table-panel"><div className="panel-head"><div><h3>Medicine list</h3><p>Sample entries</p></div></div><div className="table-scroll"><table><thead><tr><th>Medicine</th><th>Category</th><th>Strength</th><th>Price</th><th>Availability</th></tr></thead><tbody>{list.map(m => <tr key={m.id}><td>{m.emoji} {m.name}</td><td>{m.category}</td><td>{m.strength}</td><td>{m.price} AFN</td><td><span className="stock-pill">{m.stock}</span></td></tr>)}</tbody></table></div></div></>;
}
function AppointmentRow({ item, onDelete }) {
  return <div className="appointment-row"><div className="appointment-date"><b>{item.date ? new Date(item.date+"T12:00:00").toLocaleDateString("en-US",{day:"2-digit"}) : "—"}</b><span>{item.date ? new Date(item.date+"T12:00:00").toLocaleDateString("en-US",{month:"short"}) : "Date"}</span></div><div className="appointment-details"><b>{item.doctor || "Doctor appointment"}</b><span>{item.specialty || "Consultation"} · {item.clinic || "Clinic"}</span><small>◷ {item.time || "Time not set"}</small></div><span className="status-pill">{item.status || "Upcoming"}</span>{onDelete && <button className="row-delete" onClick={onDelete}>×</button>}</div>;
}
function Appointments({ appointments, saveAppointments }) {
  const [filter, setFilter] = useState("All");
  const list = appointments.filter(a => filter==="All" || a.status===filter);
  return <><PageHeading eyebrow="YOUR CARE" title="Appointments" subtitle="Review and manage appointments saved in this demo."/><div className="panel"><div className="panel-head"><div><h3>Your appointments</h3><p>{appointments.length} saved appointment(s)</p></div><div className="category-row compact">{["All","Upcoming","Completed"].map(f => <button key={f} className={filter===f?"category-active":""} onClick={() => setFilter(f)}>{f}</button>)}</div></div>{list.length ? list.map(a => <AppointmentRow key={a.id} item={a} onDelete={() => saveAppointments(appointments.filter(x => x.id!==a.id))}/>) : <EmptyState icon="▣" title="No appointments to show" text="Book a doctor appointment to see it here."/ >}</div></>;
}
function Messages({ flash }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  return <><PageHeading eyebrow="COMMUNICATION" title="Messages" subtitle="A simple demo messaging area."/><div className="panel chat-panel"><div className="chat-header"><div className="doctor-avatar blue">MP<span className="verified">✓</span></div><div><b>MyPatientHUB Support</b><small>Demo conversation · Not connected to a live service</small></div><span className="online-dot">●</span></div><div className="chat-messages"><div className="chat-bubble support">Hello! How can we help you today?<small>Support · just now</small></div>{messages.map((m,i) => <div className="chat-bubble user-bubble" key={i}>{m}<small>You · just now</small></div>)}{!messages.length && <p className="chat-hint">Messages you send here stay in this page only.</p>}</div><form className="chat-compose" onSubmit={e => {e.preventDefault(); if(message.trim()){setMessages([...messages,message.trim()]);setMessage("");flash("Demo message added.");}}}><input value={message} onChange={e => setMessage(e.target.value)} placeholder="Write a message..." /><button className="primary-btn">Send ↑</button></form></div></>;
}
function Dependents({ dependents, saveDependents }) {
  const [form, setForm] = useState({name:"",age:"",relationship:"Child",phone:""});
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  function submit(e){e.preventDefault();if(!form.name.trim())return;saveDependents([{...form,id:Date.now()},...dependents]);setForm({name:"",age:"",relationship:"Child",phone:""});setShowForm(false);}
  const list = dependents.filter(d => `${d.name} ${d.relationship} ${d.phone}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageHeading eyebrow="FAMILY HEALTH" title="My Dependents" subtitle="Keep a simple list of family members whose care you manage." action="＋ Add dependent" onAction={() => setShowForm(!showForm)}/>{showForm && <form className="panel data-form" onSubmit={submit}><h3>Add a dependent</h3><div className="form-grid"><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name"/></label><label>Age<input type="number" min="0" max="120" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="Age"/></label><label>Relationship<select value={form.relationship} onChange={e=>setForm({...form,relationship:e.target.value})}><option>Child</option><option>Spouse</option><option>Parent</option><option>Sibling</option><option>Other</option></select></label><label>Phone (optional)<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone number"/></label></div><div className="form-actions"><button type="button" className="outline-btn" onClick={()=>setShowForm(false)}>Cancel</button><button className="primary-btn">Save dependent</button></div></form>}<div className="panel large-search clinic-search"><span>⌕</span><input placeholder="Search family members..." value={search} onChange={e=>setSearch(e.target.value)}/><button onClick={()=>setSearch("")}>Clear</button></div><div className="dependent-grid">{list.map(d=><article className="dependent-card panel" key={d.id}><div className="dependent-avatar">{(d.name||"?").slice(0,1).toUpperCase()}</div><div><h3>{d.name}</h3><p>{d.relationship}{d.age ? ` · ${d.age} years` : ""}</p><small>{d.phone || "No phone added"}</small></div><button className="row-delete" title="Delete" onClick={()=>saveDependents(dependents.filter(x=>x.id!==d.id))}>×</button></article>)}</div>{!list.length && <div className="panel"><EmptyState title="No dependents yet" text="Add a family member to get started."/></div>}<p className="demo-note">Demo data is stored in this browser on this device. It is not backed up to a server.</p></>;
}
function Account({ profile, saveProfile }) {
  const [form, setForm] = useState(profile);
  useEffect(() => setForm(profile), [profile]);
  return <><PageHeading eyebrow="PROFILE" title="My Account" subtitle="Update your personal information."/><form className="panel account-panel" onSubmit={e=>{e.preventDefault();saveProfile(form);}}><div className="account-hero"><div className="avatar large">{(form.name||"U").slice(0,1).toUpperCase()}</div><div><h2>{form.name || "Your name"}</h2><p>{form.email || "Add your email address"}</p><span className="status-pill">Personal profile</span></div></div><div className="form-grid"><label>Full name<input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} required/></label><label>Email address<input type="email" value={form.email||""} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Phone number<input value={form.phone||""} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Add phone number"/></label><label>City / location<input value={form.location||""} onChange={e=>setForm({...form,location:e.target.value})}/></label></div><div className="form-actions"><button className="primary-btn">Save changes</button></div></form><div className="notice-banner"><span>ⓘ</span><div><b>Privacy reminder</b><p>This demo stores profile information in your browser only. Do not enter sensitive medical or personal details.</p></div></div></>;
}
function Settings({ settings, saveSettings }) {
  const [form, setForm] = useState(settings);
  useEffect(() => setForm(settings), [settings]);
  return <><PageHeading eyebrow="PREFERENCES" title="Settings" subtitle="Choose how MyPatientHUB looks and behaves on this device."/><form className="panel settings-panel" onSubmit={e=>{e.preventDefault();saveSettings(form);}}><div className="setting-row"><div><b>Notifications</b><p>Receive reminders and updates in this demo interface.</p></div><label className="switch"><input type="checkbox" checked={!!form.notifications} onChange={e=>setForm({...form,notifications:e.target.checked})}/><span/></label></div><div className="setting-row"><div><b>Language</b><p>Choose your preferred display language.</p></div><select value={form.language} onChange={e=>setForm({...form,language:e.target.value})}><option>English</option><option>Dari</option><option>Pashto</option></select></div><div className="setting-row"><div><b>Appearance</b><p>Choose the interface appearance.</p></div><select value={form.theme} onChange={e=>setForm({...form,theme:e.target.value})}><option>Light</option><option>Dark</option></select></div><div className="form-actions"><button className="primary-btn">Save settings</button></div></form><div className="notice-banner"><span>ⓘ</span><div><b>Account security</b><p>Password changes, real email notifications and secure authentication require a backend service and are not connected in this frontend demo.</p></div></div></>;
}

export default App;
