import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";
import { validateRegisterForm } from "../utils/validators";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const found = validateRegisterForm(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} noValidate className="card space-y-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        {submitError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{submitError}</p>}

        <Input label="Full name" name="name" autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
        <Input label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button type="submit" className="w-full" loading={loading}>
          Register
        </Button>
        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-semibold text-brand-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
