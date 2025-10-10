import { useCallback, useState } from 'react'
import './App.css'
import Register from './componentes/Registro'

function App() {

  const [ usuario, setUsuario ] = useState({
        nombre: "",
        apellido: "",
        email: "",
        clave: "",
        genero: "",
        rol: ""
  })

  const funcUsuario = useCallback((informacion) => {
    setUsuario(informacion)
  }, [])

  return (
    <main className='w-12/12 h-12/12 min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-t from-zinc-950 to-slate-700'>{
      usuario.nombre === "" || usuario.nombre === undefined || usuario.nombre === null ? (
        <Register funcUsuario={funcUsuario} />
        // recomendación colocar el componente LOGIN aqui
      ) : (
        <>
          <h1 className='text-white text-6xl'>
            {usuario.genero === "M"
              ? `Bienvenido ${usuario.nombre}`
              : `Bienvenida ${usuario.nombre}`}
          </h1>
          <button onClick={()=>setUsuario((prev)=> (prev, ""))} className='bg-gray-600 rounded-2xl p-4 ml-4 hover:bg-gray-400'>
            Cerrar sesión
          </button>
        </>
      )
    }</main>
  )
}

export default App
