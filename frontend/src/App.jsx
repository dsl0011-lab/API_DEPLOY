import { useCallback, useState } from 'react'
import './App.css'
import Register from './componentes/Registro'
import Login from './componentes/Login'
import Logo from './assets/logo-2.png'

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

  const [ flipped, setFlipped ] = useState(false);

  return (
    <main className='w-screen h-screen flex justify-center flex-col items-center overflow-hidden
    bg-gradient-to-t from-gray-400 to-black'>
      {
        usuario.nombre === "" || usuario.nombre === undefined || usuario.nombre === null ? (
          <section className='relative [perspective:1000px] w-[90vw] max-w-[600px]  h-[95vh] max-h-[600px] sm:max-h[400] flex justify-center items-center flex-col'>
          <img src={Logo} className='w-[120px] h-[75px] max-w-72 max-h-56 object-cover p-2 sm:w-fit sm:h-fit'/>
          {/* // tarjeta principal del flipped */}
          <article className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] bg-gray-800 rounded-2xl flex justify-center items-center
            ${flipped === true ? "[transform:rotateY(180deg)]" : ""}`}>
            {/* Cara frontal */}
            <div className="absolute w-full h-full top-0 left-0 [backface-visibility:hidden] p-2">
              <Login setFlipped={setFlipped} />
            </div>
            {/* Cara trasera */}
            <div className="absolute w-full h-full top-0 left-0 [backface-visibility:hidden] [transform:rotateY(180deg)] p-2 rounded-2xl
            flex flex-col">
              <Register funcUsuario={funcUsuario} setFlipped={setFlipped} />
            </div>
          </article>
        </section>
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
    </main>
  )
}

export default App
