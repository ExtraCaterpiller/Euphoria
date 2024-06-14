import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({isAdmin, component: Component, ...rest}) => {
    const { user, isAuthenticated } = useSelector(state => state.user)

    if (!isAuthenticated) return <Navigate to="/login" />
    if (isAdmin && user.role !== 'admin') return <Navigate to="/login" />

    return <Component {...rest} />
}

export default ProtectedRoute