import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../layout/MainLayout";
import { updateUser } from "../features/auth/authSlice";

export default function Settings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  function handlePasswordChange(e) {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/auth/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.message || "Could not update password");
        return;
      }

      setPasswordSuccess("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      setPasswordError("Could not connect to server");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not update profile");
        return;
      }

      dispatch(updateUser(data.user));
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }


  return (
    <MainLayout>
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Account</p>
        <h2 className="text-4xl font-bold tracking-tight">Settings</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-6"
      >
        <h3 className="text-xl font-semibold">Profile information</h3>
        <p className="mt-2 text-sm text-neutral-500">
          Update your account details.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-neutral-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Role</label>
            <input
              value={user?.role || "user"}
              disabled
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-500 outline-none"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-4 text-sm text-green-400">{success}</p>}

        <button
          disabled={loading}
          className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="mt-6 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-6"
      >
        <h3 className="text-xl font-semibold">Change password</h3>
        <p className="mt-2 text-sm text-neutral-500">
          Update your account password.
        </p>

        <div className="mt-6 space-y-4">
          <input
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Current password"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
          />

          <input
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="New password"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
          />
        </div>

        {passwordError && (
          <p className="mt-4 text-sm text-red-400">{passwordError}</p>
        )}

        {passwordSuccess && (
          <p className="mt-4 text-sm text-green-400">{passwordSuccess}</p>
        )}

        <button
          disabled={passwordLoading}
          className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-60"
        >
          {passwordLoading ? "Saving..." : "Update password"}
        </button>
      </form>
    </MainLayout>
  );
}