import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface AuthButtonsProps {
  isLoggedIn: boolean;
  handleLogout: () => Promise<void>;
  className?: string;
}

export const AuthButtons = ({ isLoggedIn, handleLogout, className = "" }: AuthButtonsProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isLoggedIn ? (
        <>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
          <Link to="/admin">
            <Button variant="outline" size="sm">
              Admin Panel
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="default" size="sm">
              Register
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};