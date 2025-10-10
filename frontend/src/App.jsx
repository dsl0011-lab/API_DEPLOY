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

const mostrarUsuarios = async () =>{
      try{
          const respuesta = await fetch( "http://127.0.0.1:8000//api/usuarios/")
          if(!respuesta.ok){ {
                  const errorData = await respuesta.json()
                  console.error("Ha ocurrido el siguiente problema", errorData)
          }}
          const data = await respuesta.json()
          console.log("Los datos recibidos son:", data)
          funcUsuario(data)
      }catch(err){
          console.log("Ha ocurrido un error no documentado: ",err)
      }
}

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
      
    }
    <button onClick={()=>mostrarUsuarios()} className='bg-gray-600 rounded-2xl p-4 ml-4 hover:bg-gray-400'>
      Mostrar usuarios
    </button>
    </main>
  )
}

export default App
