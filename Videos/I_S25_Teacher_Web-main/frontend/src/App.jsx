import { useCallback, useState } from 'react'
import './App.css'
import Register from './componentes/Registro'
import Login from './componentes/Login'
import Dashboard from './componentes/Dashboard/Dashboard.jsx'
import Logo from './assets/logo-2.png'

function App() {
  const [flipped, setFlipped] = useState(false)
  const [usuario, setUsuario] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    rol: "",
  })
  const [tokenState, setTokenState] = useState("")
  const [showDashboard, setShowDashboard] = useState(false) /*Poner en true para mostrar el dashboard */

  const funcUsuario = useCallback((informacion, token) => {
    setUsuario(informacion)
    if (token !== tokenState && token) setTokenState(token)
    if (informacion && informacion.first_name) setShowDashboard(true) 
  }, [tokenState])

  
  const handleLogout = () => {
    setUsuario({
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      rol: "",
    })
    setTokenState("")
    setShowDashboard(true)
    setFlipped(false)
  }

  return (
    <main className='w-screen h-screen flex justify-center flex-col items-center overflow-hidden bg-gradient-to-t from-gray-400 to-black'>
      {showDashboard ? (
        <div className="w-full h-full">
          <Dashboard />
          <div className="absolute top-4 right-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        <section className='relative [perspective:1000px] w-[90vw] max-w-[600px]  h-[95vh] max-h-[600px] sm:max-h[400] flex justify-center items-center flex-col'>
          <img src={Logo} className='w-[120px] h-[75px] max-w-72 max-h-56 object-cover p-2 sm:w-fit sm:h-fit'/>
          
          <article className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] bg-gray-800 rounded-2xl flex justify-center items-center
            ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
            
            <div className="absolute w-full h-full top-0 left-0 [backface-visibility:hidden] p-2">
              <Login setFlipped={setFlipped} funcUsuario={funcUsuario} tokenState={tokenState} setTokenState={setTokenState}/>
            </div>
            
            <div className="absolute w-full h-full top-0 left-0 [backface-visibility:hidden] [transform:rotateY(180deg)] p-2 rounded-2xl flex flex-col">
              <Register funcUsuario={funcUsuario} setFlipped={setFlipped} tokenState={tokenState} setTokenState={setTokenState}/>
            </div>
          </article>
        </section>
      )}
    </main>
  )
}

export default App

