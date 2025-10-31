import { NavLink, Outlet } from "react-router-dom";
export default function LayoutProfesor() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-4 space-y-2">
        <h1 className="text-xl font-bold mb-4">Panel Profesor</h1>
        <nav className="flex flex-col gap-2">
          <NavLink to="/profesor">Cursos</NavLink>
          <NavLink to="/profesor/tareas">Tareas</NavLink>
          <NavLink to="/profesor/calificaciones">Calificaciones</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
