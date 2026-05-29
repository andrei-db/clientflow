import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { apiFetch } from "../lib/api";
export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const login = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            if (!login.res.ok) {
                setError(login.data.message || "Something went wrong");
                return;
            }

            dispatch(loginSuccess(login.data));

            window.location.href = "/";
        } catch (err) {
            setError("Could not connect to server");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#070707] text-white grid place-items-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl"
            >
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="mt-2 text-sm text-neutral-500">
                    Sign in to continue to ClientFlow.
                </p>

                <div className="mt-8 space-y-4">
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
                    />

                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
                    />
                </div>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                <button
                    disabled={loading}
                    className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
}