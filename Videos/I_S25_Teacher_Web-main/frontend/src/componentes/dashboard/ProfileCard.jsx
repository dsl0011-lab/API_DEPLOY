const ProfileCard = ({ user }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{user.nombre}</h2>
            <p className="text-gray-700 dark:text-gray-300">Email: {user.email}</p>
            <p className="text-gray-700 dark:text-gray-300">Rol: {user.rol}</p>
        </div>
    )
}

export default ProfileCard
