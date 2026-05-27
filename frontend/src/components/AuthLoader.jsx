import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../features/auth/authSlice";

export default function AuthLoader({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await fetch("http://localhost:4000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        dispatch(logout());
        return;
      }

      const data = await res.json();
      dispatch(setUser(data.user));
    }

    loadUser();
  }, [dispatch]);

  return children;
}