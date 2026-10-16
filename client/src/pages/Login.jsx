import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";
import { validateLoginForm } from "../utils/validators";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const { login, isAuthenticated, authMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Controlled components
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in – go straight to the requested page
  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const found = validateLoginForm(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true }); // redirect to the page the user originally wanted
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} noValidate className="card space-y-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Login</h1>

        {from !== "/" && !authMessage && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">Please login to continue with your booking.</p>
        )}
        {authMessage && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700" role="alert">{authMessage}</p>}
        {submitError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{submitError}</p>}

        <Input label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button type="submit" className="w-full" loading={loading}>
          Login
        </Button>

        <p className="text-center text-sm text-slate-600">
          New here?{" "}
          <Link to="/register" state={location.state} className="font-semibold text-brand-600 underline">
            Create an account
          </Link>
        </p>
        <p className="rounded bg-slate-50 p-2 text-center text-xs text-slate-500">
          Demo account: <b>demo@movie.com</b> / <b>Demo@123</b>
        </p>
      </form>
    </div>
  );
}
