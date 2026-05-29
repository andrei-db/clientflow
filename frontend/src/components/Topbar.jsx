import { Bell, LogOut, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "../features/theme/themeSlice";
export default function Topbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const { mode } = useSelector((state) => state.theme);

    function handleLogout() {
        dispatch(logout());
        navigate("/login");
    }
    return (
        <header className="mb-8 flex items-center justify-between">
            <div>
                <p className="text-sm text-neutral-500">Welcome back</p>
                <h1 className="text-2xl font-semibold">Manage your business flow</h1>
            </div>

            

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <button
                onClick={() => dispatch(toggleTheme())}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/10 transition"
            >
                {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
              
                <div className="h-9 w-9 rounded-full bg-white text-black grid place-items-center font-bold">
                    {user?.name?.charAt(0) || "U"}
                </div>

                <div className="hidden sm:block">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-neutral-500">{user?.role || "user"}</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="ml-2 rounded-xl p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
}