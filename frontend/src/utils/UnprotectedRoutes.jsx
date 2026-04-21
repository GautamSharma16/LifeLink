import { Navigate, useLocation } from "react-router-dom";


// eslint-disable-next-line react/prop-types
function UnprotectedWrapper({ children }) {
  const token = localStorage.getItem("lifelink_token");
  const location = useLocation();
  return token ? (
     <Navigate to="/dashboard" replace state={{ path: location.pathname }} />
  ) : (
    <div>
        {children}
    </div> 
  );
}

export default UnprotectedWrapper;
