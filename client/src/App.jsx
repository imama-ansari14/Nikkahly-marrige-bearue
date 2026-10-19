import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Edit3,
  HeartHandshake,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Trash2,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Logo from "../../public/nikkahly-logo.png";
import { api, imageUrl } from "./api";

const initial = {
  name: "",
  gender: "",
  age: "",
  cast: "",
  education: "",
  passingYear: "",
  height: "",
  maritalStatus: "",
  motherTongue: "",
  jobTitle: "",
  designation: "",
  earningSalary: "",
  fatherOccupation: "",
  mother: "",
  brothers: "",
  sisters: "",
  familyStatus: "",
  country: "",
  city: "",
  houseOwnRent: "",
  fullAddress: "",
  reqMaritalStatus: "",
  reqAgeLimit: "",
  reqCast: "",
  reqHeight: "",
  reqCity: "",
  reqArea: "",
  reqDemand: "",
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("nik_token"));
  if (!token)
    return (
      <Login
        onLogin={(t) => {
          localStorage.setItem("nik_token", t);
          setToken(t);
        }}
      />
    );
  return (
    <Shell
      onLogout={() => {
        localStorage.removeItem("nik_token");
        setToken(null);
      }}
    />
  );
}

// Login component (user authentication)
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      onLogin(data.token);
    } catch (e) {
      setError(e.response?.data?.message || "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-950 via-wine-900 to-stone-900 px-4 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center">
        <form
          onSubmit={submit}
          className="w-full rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-wine-800">
            <img
              src={Logo}
              alt="Nikkahly Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <p className="text-center text-xs font-bold uppercase tracking-[.25em] text-gold-600">
            Nikkahly
          </p>
          <h1 className="mt-2 text-center text-2xl font-bold text-wine-900">
            Marriage Bureau
          </h1>
          <p className="mt-2 text-center text-sm text-stone-500">
            Private client management
          </p>
          <div className="mt-7 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                className="field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
              />
            </div>
            {error && <Alert>{error}</Alert>}
            <button className="btn-primary w-full" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-stone-400">
            Private access • Not a public client website
          </p>
        </form>
      </div>
    </div>
  );
}

//
function Shell({ onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/clients", label: "All Clients", icon: Users },
  ];
  return (
    <div className="min-h-screen bg-[#fbf8f6]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-stone-200 bg-white p-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-wine-700 text-gold-300">
              <img
                src={Logo}
                alt="Nikkahly Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="font-bold text-wine-900">Nikkahly</p>
              <p className="text-xs tracking-wider text-gold-600">
                MARRIAGE BUREAU
              </p>
            </div>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold ${location.pathname === to || (to === "/clients" && location.pathname.startsWith("/clients/")) ? "bg-wine-50 text-wine-800" : "text-stone-600 hover:bg-stone-50"}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5">
          <button onClick={onLogout} className="btn-secondary w-full">
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-stone-950/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between">
            <button
              className="rounded-xl p-2 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Private records
              </p>
              <p className="font-semibold text-wine-900">
                Nikkahly Client Manager
              </p>
            </div>
            <Link to="/clients/new" className="btn-primary">
              <Plus size={17} />{" "}
              <span className="hidden sm:inline">Add Client</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// Dashboard component
function Dashboard() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/clients")
      .then((r) => setClients(r.data))
      .catch((e) => setError(e.response?.data?.message || e.message));
  }, []);
  const male = clients.filter((x) => x.gender === "Male").length,
    female = clients.filter((x) => x.gender === "Female").length;
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <p className="text-sm font-semibold text-gold-600">Welcome back</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-wine-950">
          Client Dashboard
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Keep all marriage profiles organized in one private place.
        </p>
      </div>
      {error && <Alert>{error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat icon={Users} label="Total clients" value={clients.length} />
        <Stat icon={UserRound} label="Male profiles" value={male} />
        <Stat icon={HeartHandshake} label="Female profiles" value={female} />
      </div>
      <section className="card mt-7 overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 p-5">
          <div>
            <h2 className="font-bold text-wine-900">Recent profiles</h2>
            <p className="mt-1 text-xs text-stone-500">Newest records first</p>
          </div>
          <Link to="/clients" className="text-sm font-semibold text-wine-700">
            View all
          </Link>
        </div>
        {clients.slice(0, 6).map((c) => (
          <Row key={c._id} c={c} />
        ))}
        {!clients.length && (
          <Empty
            title="No clients yet"
            text="Add your first profile to get started."
          />
        )}
      </section>
    </div>
  );
}

// Clients component
function Clients() {
  const [clients, setClients] = useState([]),
    [search, setSearch] = useState(""),
    [gender, setGender] = useState("All"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    const t = setTimeout(
      () =>
        api
          .get("/clients", {
            params: { search, gender: gender === "All" ? "" : gender },
          })
          .then((r) => setClients(r.data))
          .catch((e) => setError(e.response?.data?.message || e.message))
          .finally(() => setLoading(false)),
      200,
    );
    return () => clearTimeout(t);
  }, [search, gender]);
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-wine-950">All Clients</h1>
          <p className="mt-2 text-sm text-stone-500">
            Filter profiles by gender or search by client information.
          </p>
        </div>
        <Link to="/clients/new" className="btn-primary">
          <Plus size={17} /> Add Client
        </Link>
      </div>
      <div className="card mb-5 p-3">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-stone-400"
              size={18}
            />
            <input
              className="field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, city, caste, job..."
            />
          </div>
          <div className="flex rounded-xl bg-stone-100 p-1">
            {["All", "Male", "Female"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${gender === g ? "bg-white text-wine-800 shadow-sm" : "text-stone-500"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && <Alert>{error}</Alert>}
      {loading ? (
        <Loading />
      ) : clients.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((c) => (
            <Card key={c._id} c={c} />
          ))}
        </div>
      ) : (
        <div className="card">
          <Empty
            title="No matching clients"
            text="Try another filter or add a new profile."
          />
        </div>
      )}
    </div>
  );
}

// ClientForm component
function ClientForm() {
  const { id } = useParams(),
    edit = !!id,
    navigate = useNavigate();
  const [form, setForm] = useState(initial),
    [photos, setPhotos] = useState([]),
    [saved, setSaved] = useState([]),
    [busy, setBusy] = useState(edit),
    [error, setError] = useState("");
  useEffect(() => {
    if (!edit) return;
    Promise.all([api.get(`/clients/${id}`), api.get(`/clients/${id}/images`)])
      .then(([a, b]) => {
        setForm({ ...initial, ...a.data });
        setSaved(b.data);
      })
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setBusy(false));
  }, [id]);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = edit
        ? (await api.put(`/clients/${id}`, form)).data
        : (await api.post("/clients", form)).data;
      if (photos.length) {
        const fd = new FormData();
        photos.forEach((f) => fd.append("images", f));
        await api.post(`/clients/${data._id}/images`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate(`/clients/${data._id}`);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setBusy(false);
    }
  }
  async function delPhoto(p) {
    if (!confirm("Delete this photo?")) return;
    try {
      await api.delete(`/images/${p._id}`);
      setSaved((s) => s.filter((x) => x._id !== p._id));
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  }
  if (busy && edit) return <Loading />;
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to={edit ? `/clients/${id}` : "/clients"}
          className="btn-secondary !px-3"
        >
          <ArrowLeft size={17} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-wine-950">
            {edit ? "Edit Client" : "Add New Client"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Record the details from your WhatsApp client form.
          </p>
        </div>
      </div>
      {error && <Alert>{error}</Alert>}
      <form onSubmit={submit} className="space-y-5">
        <Section title="Client Details" icon={UserRound}>
          <Field
            label="Name"
            required
            v={form.name}
            set={(v) => set("name", v)}
          />
          <Select
            label="Gender"
            v={form.gender}
            set={(v) => set("gender", v)}
            opts={["Male", "Female"]}
          />
          <Field
            label="Age"
            type="number"
            v={form.age}
            set={(v) => set("age", v)}
          />
          <Field label="Cast" v={form.cast} set={(v) => set("cast", v)} />
          <Field
            label="Education"
            v={form.education}
            set={(v) => set("education", v)}
          />
          <Field
            label="Passing Year"
            type="number"
            v={form.passingYear}
            set={(v) => set("passingYear", v)}
          />
          <Field label="Height" v={form.height} set={(v) => set("height", v)} />
          <Select
            label="Marital Status"
            v={form.maritalStatus}
            set={(v) => set("maritalStatus", v)}
            opts={["Single", "Divorced", "Widowed", "Separated", "Other"]}
          />
          <Field
            label="Mother Tongue"
            v={form.motherTongue}
            set={(v) => set("motherTongue", v)}
          />
          <Field
            label="Job Title"
            v={form.jobTitle}
            set={(v) => set("jobTitle", v)}
          />
          <Field
            label="Designation"
            v={form.designation}
            set={(v) => set("designation", v)}
          />
          <Field
            label="Earning / Salary"
            v={form.earningSalary}
            set={(v) => set("earningSalary", v)}
          />
        </Section>
        <Section title="Family" icon={Users}>
          <Field
            label="Father's Occupation"
            v={form.fatherOccupation}
            set={(v) => set("fatherOccupation", v)}
          />
          <Field label="Mother" v={form.mother} set={(v) => set("mother", v)} />
          <Field
            label="Brothers"
            v={form.brothers}
            set={(v) => set("brothers", v)}
          />
          <Field
            label="Sisters"
            v={form.sisters}
            set={(v) => set("sisters", v)}
          />
          <Field
            label="Family Status"
            v={form.familyStatus}
            set={(v) => set("familyStatus", v)}
          />
          <Field
            label="Country"
            v={form.country}
            set={(v) => set("country", v)}
          />
          <Field label="City" v={form.city} set={(v) => set("city", v)} />
          <Select
            label="House"
            v={form.houseOwnRent}
            set={(v) => set("houseOwnRent", v)}
            opts={["Own", "Rent", "Other"]}
          />
          <Area
            label="Full Address"
            cls="md:col-span-2"
            v={form.fullAddress}
            set={(v) => set("fullAddress", v)}
          />
        </Section>
        <Section title="Client Requirements for Match" icon={HeartHandshake}>
          <Select
            label="1. Marital Status"
            v={form.reqMaritalStatus}
            set={(v) => set("reqMaritalStatus", v)}
            opts={[
              "Any",
              "Single",
              "Divorced",
              "Widowed",
              "Separated",
              "Other",
            ]}
          />
          <Field
            label="2. Age Limit"
            v={form.reqAgeLimit}
            set={(v) => set("reqAgeLimit", v)}
          />
          <Field
            label="3. Cast"
            v={form.reqCast}
            set={(v) => set("reqCast", v)}
          />
          <Field
            label="4. Height"
            v={form.reqHeight}
            set={(v) => set("reqHeight", v)}
          />
          <Field
            label="5. City"
            v={form.reqCity}
            set={(v) => set("reqCity", v)}
          />
          <Field
            label="6. Area"
            v={form.reqArea}
            set={(v) => set("reqArea", v)}
          />
          <Area
            label="7. Demand"
            cls="md:col-span-2"
            v={form.reqDemand}
            set={(v) => set("reqDemand", v)}
          />
        </Section>
        <Section title="Client Photos" icon={ImagePlus}>
          <div className="md:col-span-2">
            <label className="label">Upload multiple images</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-8 text-center hover:border-gold-300 hover:bg-gold-50">
              <Upload className="text-wine-700" />
              <p className="mt-2 font-semibold text-stone-700">Choose photos</p>
              <p className="mt-1 text-xs text-stone-400">
                Select multiple JPG, PNG or WEBP images
              </p>
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPhotos(Array.from(e.target.files || []))}
              />
            </label>
          </div>
          {saved.length > 0 && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-semibold">Saved photos</p>
              <PhotoGrid photos={saved} onDelete={delPhoto} />
            </div>
          )}
          {photos.length > 0 && (
            <div className="md:col-span-2 flex flex-wrap gap-2">
              {photos.map((f) => (
                <span
                  key={f.name + f.size}
                  className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-wine-800"
                >
                  {f.name}
                </span>
              ))}
            </div>
          )}
        </Section>
        <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
          <Link
            to={edit ? `/clients/${id}` : "/clients"}
            className="btn-secondary"
          >
            Cancel
          </Link>
          <button className="btn-primary" disabled={busy}>
            <Check size={17} />
            {busy ? "Saving..." : edit ? "Save Changes" : "Save Client"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ClientDetails() {
  const { id } = useParams(),
    navigate = useNavigate();
  const [c, setC] = useState(null),
    [photos, setPhotos] = useState([]),
    [error, setError] = useState("");
  async function load() {
    try {
      const [a, b] = await Promise.all([
        api.get(`/clients/${id}`),
        api.get(`/clients/${id}/images`),
      ]);
      setC(a.data);
      setPhotos(b.data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  }
  useEffect(() => {
    load();
  }, [id]);
  async function del() {
    if (
      !confirm(
        "Delete this client and all their photos? This cannot be undone.",
      )
    )
      return;
    try {
      await api.delete(`/clients/${id}`);
      navigate("/clients");
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  }
  async function delPhoto(p) {
    if (!confirm("Delete this photo?")) return;
    try {
      await api.delete(`/images/${p._id}`);
      setPhotos((x) => x.filter((y) => y._id !== p._id));
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  }
  if (!c) return error ? <Alert>{error}</Alert> : <Loading />;
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/clients" className="btn-secondary !px-3">
            <ArrowLeft size={17} />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              {c.gender || "Client"} profile
            </p>
            <h1 className="text-2xl font-bold text-wine-950">{c.name}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/clients/${id}/edit`} className="btn-secondary">
            <Edit3 size={16} /> Edit
          </Link>
          <button
            onClick={del}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
      {error && <Alert>{error}</Alert>}
      <div className="grid gap-5 lg:grid-cols-[1fr_350px]">
        <div className="space-y-5">
          <InfoSection title="Client Details">
            <Info l="Name" v={c.name} />
            <Info l="Gender" v={c.gender} />
            <Info l="Age" v={c.age && `${c.age} years`} />
            <Info l="Cast" v={c.cast} />
            <Info l="Education" v={c.education} />
            <Info l="Passing Year" v={c.passingYear} />
            <Info l="Height" v={c.height} />
            <Info l="Marital Status" v={c.maritalStatus} />
            <Info l="Mother Tongue" v={c.motherTongue} />
            <Info l="Job Title" v={c.jobTitle} />
            <Info l="Designation" v={c.designation} />
            <Info l="Earning / Salary" v={c.earningSalary} />
          </InfoSection>
          <InfoSection title="Family">
            <Info l="Father's Occupation" v={c.fatherOccupation} />
            <Info l="Mother" v={c.mother} />
            <Info l="Brothers" v={c.brothers} />
            <Info l="Sisters" v={c.sisters} />
            <Info l="Family Status" v={c.familyStatus} />
            <Info l="Country" v={c.country} />
            <Info l="City" v={c.city} />
            <Info l="House" v={c.houseOwnRent} />
            <Info l="Full Address" v={c.fullAddress} full />
          </InfoSection>
          <InfoSection title="Client Requirements for Match">
            <Info l="Marital Status" v={c.reqMaritalStatus} />
            <Info l="Age Limit" v={c.reqAgeLimit} />
            <Info l="Cast" v={c.reqCast} />
            <Info l="Height" v={c.reqHeight} />
            <Info l="City" v={c.reqCity} />
            <Info l="Area" v={c.reqArea} />
            <Info l="Demand" v={c.reqDemand} full />
          </InfoSection>
        </div>
        <aside className="card h-fit overflow-hidden">
          <div className="border-b border-stone-100 p-5">
            <h2 className="font-bold text-wine-900">Client Photos</h2>
            <p className="mt-1 text-xs text-stone-500">
              {photos.length} saved image{photos.length === 1 ? "" : "s"}
            </p>
          </div>
          {photos.length ? (
            <div className="p-4">
              <PhotoGrid photos={photos} onDelete={delPhoto} />
            </div>
          ) : (
            <Empty
              title="No photos"
              text="Edit this profile to upload images."
            />
          )}
          <div className="border-t border-stone-100 p-4">
            <Link to={`/clients/${id}/edit`} className="btn-secondary w-full">
              <ImagePlus size={16} /> Manage photos
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

const Field = ({ label, v, set, type = "text", required, placeholder }) => (
  <div>
    <label className="label">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    <input
      className="field"
      type={type}
      value={v ?? ""}
      required={required}
      onChange={(e) => set(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);
const Select = ({ label, v, set, opts }) => (
  <div>
    <label className="label">{label}</label>
    <select
      className="field"
      value={v ?? ""}
      onChange={(e) => set(e.target.value)}
    >
      <option value="">Select...</option>
      {opts.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);
const Area = ({ label, v, set, cls = "" }) => (
  <div className={cls}>
    <label className="label">{label}</label>
    <textarea
      className="field min-h-28 resize-y"
      value={v ?? ""}
      onChange={(e) => set(e.target.value)}
    />
  </div>
);
const Section = ({ title, icon: Icon, children }) => (
  <section className="card overflow-hidden">
    <div className="flex items-center gap-3 border-b border-stone-100 bg-wine-50/40 px-5 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-50 text-wine-800">
        <Icon size={18} />
      </div>
      <h2 className="font-bold text-wine-900">{title}</h2>
    </div>
    <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
  </section>
);
const InfoSection = ({ title, children }) => (
  <section className="card overflow-hidden">
    <div className="border-b border-stone-100 px-5 py-4">
      <h2 className="font-bold text-wine-900">{title}</h2>
    </div>
    <div className="grid gap-x-6 md:grid-cols-2">{children}</div>
  </section>
);

const Info = ({ l, v, full }) =>
  v === null || v === undefined || v === "" ? null : (
    <div
      className={`border-b border-stone-100 px-5 py-4 ${full ? "md:col-span-2" : ""}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
        {l}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-stone-800">
        {String(v)}
      </p>
    </div>
  );
const Stat = ({ icon: Icon, label, value }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wine-50 text-wine-700">
        <Icon size={19} />
      </div>
      <span className="text-3xl font-bold text-wine-950">{value}</span>
    </div>
    <p className="mt-4 text-sm font-medium text-stone-500">{label}</p>
  </div>
);
const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-2.5 py-1 text-xs font-medium text-wine-800">
    {children}
  </span>
);

// Client card component
function Card({ c }) {
  return (
    <Link
      to={`/clients/${c._id}`}
      className="card group p-5 transition hover:-translate-y-0.5 hover:border-gold-300"
    >
      <div className="flex gap-4">
        <Avatar c={c} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="truncate font-bold text-wine-950">{c.name}</h3>
              <p className="mt-1 text-sm text-stone-500">
                {[c.age && `${c.age} years`, c.city]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </div>
            <ChevronRight
              size={18}
              className="text-stone-300 group-hover:text-wine-700"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.gender && <Badge>{c.gender}</Badge>}
            {c.cast && <Badge>{c.cast}</Badge>}
            {c.maritalStatus && <Badge>{c.maritalStatus}</Badge>}
            {c.imageCount > 0 && (
              <Badge>
                <Camera size={12} /> {c.imageCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Client row component
function Row({ c }) {
  return (
    <Link
      to={`/clients/${c._id}`}
      className="flex items-center gap-4 border-b border-stone-100 p-4 hover:bg-stone-50"
    >
      <Avatar c={c} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-wine-950">{c.name}</p>
        <p className="truncate text-sm text-stone-500">
          {[c.gender, c.age && `${c.age} years`, c.city]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </div>
      <ChevronRight size={18} className="text-stone-300" />
    </Link>
  );
}

// Avatar component
function Avatar({ c }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-wine-50 font-bold text-wine-800">
      {c.gender === "Female" ? (
        "F"
      ) : c.gender === "Male" ? (
        "M"
      ) : (
        <UserRound size={18} />
      )}
    </div>
  );
}
function PhotoGrid({ photos, onDelete }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {photos.map((p) => (
        <div
          key={p._id}
          className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100"
        >
          <img
            src={imageUrl(p._id)}
            alt={p.originalName || "Client"}
            className="h-full w-full object-cover"
          />
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(p)}
              className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-600 opacity-0 shadow transition group-hover:opacity-100"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
const Empty = ({ title, text }) => (
  <div className="p-10 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
      <HeartHandshake size={20} />
    </div>
    <h3 className="mt-3 font-semibold text-stone-800">{title}</h3>
    <p className="mt-1 text-sm text-stone-500">{text}</p>
  </div>
);
const Alert = ({ children }) => (
  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {children}
  </div>
);
const Loading = () => (
  <div className="flex min-h-[30vh] items-center justify-center text-sm text-stone-500">
    Loading...
  </div>
);

export default App;
