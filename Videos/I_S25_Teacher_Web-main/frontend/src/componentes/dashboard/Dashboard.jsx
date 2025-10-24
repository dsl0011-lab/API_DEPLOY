// frontend/src/componentes/Dashboard/Dashboard.jsx
import Sidebar from "./Sidebar"
import { useState, useEffect } from "react"

// Tarjeta de perfil editable
const ProfileCard = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false)
  const [tempUser, setTempUser] = useState(user)

  const saveUser = (e) => {
    e.preventDefault()
    setUser(tempUser)
    setEditing(false)
  }

  useEffect(() => {
    setTempUser(user)
  }, [user])

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Perfil</h3>
      {editing ? (
        <form onSubmit={saveUser} className="mt-4 space-y-2">
          <input
            type="text"
            value={tempUser.nombre}
            onChange={(e) => setTempUser({ ...tempUser, nombre: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            value={tempUser.email}
            onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded border"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4">
          <p>Nombre: {user.nombre}</p>
          <p>Email: {user.email}</p>
          <p>Rol: {user.rol}</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Editar perfil
          </button>
        </div>
      )}
    </div>
  )
}

// Componente principal del Dashboard
const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [asignaturas, setAsignaturas] = useState([])

  useEffect(() => {
    // Datos simulados
    const mockUser = {
      nombre: "Martín Gómez",
      email: "martin@example.com",
      rol: "Profesor",
    }
    const mockAsignaturas = ["Matemáticas", "Física", "Programación", "Historia"]

    setTimeout(() => {
      setUser(mockUser)
      setAsignaturas(mockAsignaturas)
    }, 500)
  }, [])

  if (!user) return <div className="text-white p-6">Cargando Dashboard...</div>

  return (
    <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <ProfileCard user={user} setUser={setUser} />

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Asignaturas
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {asignaturas.map((asig, i) => (
              <li
                key={i}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-center"
              >
                {asig}
                <button
                  onClick={() =>
                    setAsignaturas(asignaturas.filter((_, index) => index !== i))
                  }
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              const nueva = prompt("Nombre de la nueva asignatura")
              if (nueva) setAsignaturas([...asignaturas, nueva])
            }}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Agregar asignatura
          </button>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
