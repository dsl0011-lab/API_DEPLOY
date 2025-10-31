import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import PrivateRoute from '../Authorization/PrivateRoute';
import ProfileCard from '../Dashboard/ProfileCard';
import Asignaturas from '../Dashboard/Asignaturas';

// --- Profesor ---
import RequireRole from '../Profesor/RequireRole';
import LayoutProfesor from '../Profesor/LayoutProfesor';
import CursosPage from '../Profesor/CursosPage';
import CursoDetallePage from '../Profesor/CursoDetallePage';
import TareasPage from '../Profesor/TareasPage';
import CalificacionesPage from '../Profesor/CalificacionesPage';

function AppContent() {

    return (
        <>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path='/*' element={<Dashboard />}>
                        <Route path='perfil' element={<ProfileCard />} />
                        <Route path='asignaturas' element={<Asignaturas />} />
                        <Route RequireRole='T' element={<LayoutProfesor />}>
                          <Route path='cursos' element={<CursosPage />} />
                          <Route path='tareas' element={<TareasPage />} />
                          <Route path='calificaciones' element={<CalificacionesPage />}/>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}
export default AppContent;
