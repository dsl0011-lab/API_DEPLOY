import { useEffect, useState } from "react";
import { apiFetch } from "./api";
export default function CalificacionesPage() {
  const token = localStorage.getItem("token");
  const [entregas, setEntregas] = useState([]);
  const [notas, setNotas] = useState({});
  useEffect(() => { apiFetch("/api/profesor/entregas/", { token }).then(setEntregas); }, [token]);
  const calificar = async (entregaId) => {
    const body = { entrega: entregaId, nota: Number(notas[entregaId] || 0) };
    const res = await apiFetch("/api/profesor/calificaciones/", { method:"POST", body, token });
    alert(`Calificada con nota ${res.nota}`);
  };
  return (
    <div>
      <h1 className="text-xl font-bold mb-3">Calificaciones</h1>
      <ul className="space-y-2">
        {entregas.map(e => (
          <li key={e.id} className="border rounded p-3">
            <div className="font-semibold">Entrega #{e.id}</div>
            <input className="border p-1 rounded mr-2" placeholder="Nota"
              value={notas[e.id] ?? ""} onChange={(ev)=>setNotas({...notas, [e.id]: ev.target.value})}/>
            <button className="px-3 py-1 rounded border" onClick={()=>calificar(e.id)}>Guardar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

