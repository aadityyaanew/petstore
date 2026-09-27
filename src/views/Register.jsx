import { Navigate } from 'react-router-dom';

const Register = () => {
  // Since we are using Google Auth only, redirect to login
  return <Navigate to="/login" replace />;
};

export default Register;
