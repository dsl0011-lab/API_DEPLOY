import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "./api";
export default function CursosPage() {
  const token = localStorage.getItem("token");
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  useEffect(() => { apiFetch("/api/profesor/cursos/", { token }).then(setCursos); }, [token]);
  const crear = async (e) => {
    e.preventDefault();
    const nuevo = await apiFetch("/api/profesor/cursos/", { method:"POST", body:form, token });
    setCursos([nuevo, ...cursos]); setForm({ nombre:"", descripcion:"" });
  };
  return (
    <div className="space-y-4">
      <form onSubmit={crear} className="flex gap-2">
        <input className="border p-2 rounded w-64" placeholder="Nombre"
               value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})}/>
        <input className="border p-2 rounded flex-1" placeholder="Descripción"
               value={form.descripcion} onChange={e=>setForm({...form, descripcion:e.target.value})}/>
        <button className="px-4 py-2 rounded border">Crear</button>
      </form>
      <ul className="grid md:grid-cols-2 gap-3">
        {cursos.map(c=>(
          <li key={c.id} className="border rounded p-3">
            <div className="font-semibold">{c.nombre}</div>
            <div className="text-sm text-gray-600">{c.descripcion}</div>
            <Link className="underline mt-2 inline-block" to={`/profesor/cursos/${c.id}`}>Abrir</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
