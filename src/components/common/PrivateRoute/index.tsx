import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '@/context/userContext'

const PrivateRoute = () => {
    const location = useLocation()
    const { currentUser } = useCurrentUser()

    if (location.pathname === '/auth/login' && currentUser?.token) {
        return <Navigate to="/" replace />
    }

    return currentUser?.token ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />
}

export default PrivateRoute