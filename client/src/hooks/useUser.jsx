import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const getUser = () => {
    const userLocal = JSON.parse(window.localStorage.getItem("user"));
    if (userLocal) {
      setUser(userLocal);
      return true;
    }
    return false;
  }

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const handleLogin = (user) => {
    window.localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    window.history.back()
  };

  useEffect(() => {
    getUser()
  }, [])

  return { user, getUser, handleLogout, handleLogin }
}
