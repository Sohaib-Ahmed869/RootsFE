import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from "../../services/authService"; // Adjust the import path as needed

const ProtectedRoute = ({ element: Component, role,...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await AuthService.checkAuth(role);
        console.log(response.data) // Replace with your actual auth check function
        if (response.data.authorization) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;