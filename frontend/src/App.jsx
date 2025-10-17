import { useCallback, useState } from 'react'
import './App.css'
import Register from './componentes/Registro'
import Login from './componentes/Login'
import Logo from './assets/logo-2.png'

function App() {
  const [ flipped, setFlipped ] = useState(false);
  const [ usuario, setUsuario ] = useState({
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        rol: "",
  })
  const [ tokenState, setTokenState] = useState("");
  //funcion que ayudara a guardar la informacion del usuario
  const funcUsuario = useCallback((informacion, token) => {
    setUsuario(informacion)
    if(token !== tokenState && token)setTokenState(token)
  }, [tokenState])

  return (
    <main className='w-screen h-screen flex justify-center flex-col items-center overflow-hidden
    bg-gradient-to-t from-gray-400 to-black'>
      {
        usuario.first_name === "" || usuario.first_name === undefined || usuario.first_name === null ? (
          <section className='relative [perspective:1000px] w-[90vw] max-w-[600px]  h-[95vh] max-h-[600px] sm:max-h[400] flex justify-center items-center flex-col'>
          <img src={Logo} className='w-[120px] h-[75px] max-w-72 max-h-56 object-cover p-2 sm:w-fit sm:h-fit'/>
          {/* // tarjeta principal del flipped */}
          <article className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] bg-gray-800 rounded-2xl flex justify-center items-center
            ${flipped === true ? "[transform:rotateY(180deg)]" : ""}`}>
            {/* Cara frontal */}
            <div className="absolute w-full h-full top-0 left-0 [backface-visibility:hidden] p-2">
              <Login setFlipped={setFlipped} funcUsuario={funcUsuario} tokenState={tokenState} setTokenState={setTokenState}/>
            </div>
            {/* Cara trasera */}
            <div className="absolute w-full h-full top-0 left-0 [backface-visibility:hidden] [transform:rotateY(180deg)] p-2 rounded-2xl
            flex flex-col">
              <Register funcUsuario={funcUsuario} setFlipped={setFlipped} tokenState={tokenState} setTokenState={setTokenState}/>
            </div>
          </article>
        </section>
        // recomendación colocar el componente LOGIN aqui
      ) : (
        <>
          <h1 className='text-white text-6xl'>
            {usuario.gender === "M"
              ? `Bienvenido ${usuario.first_name} ${usuario.last_name}`
              : `Bienvenida ${usuario.first_name} ${usuario.last_name}`}
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
