import Input from "./Input";

const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

// Controlled payment form. The parent owns `value`, `errors` and the submit handler.
export default function Payment({ value, onChange, errors = {} }) {
  const set = (field) => (e) => {
    let v = e.target.value;
    if (field === "cardNumber") v = formatCard(v);
    if (field === "expiry") v = formatExpiry(v);
    if (field === "cvv") v = v.replace(/\D/g, "").slice(0, 3);
    onChange({ ...value, [field]: v });
  };

  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 text-lg font-bold text-slate-900">Payment</legend>

      <div className="flex gap-2" role="radiogroup" aria-label="Payment method">
        {[
          { id: "card", label: "💳 Card" },
          { id: "upi", label: "📱 UPI" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={value.method === m.id}
            onClick={() => onChange({ ...value, method: m.id })}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              value.method === m.id ? "bg-brand-500 text-white" : "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {errors.method && <p className="text-sm text-red-600">{errors.method}</p>}

      {value.method === "card" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            className="sm:col-span-2"
            label="Card number"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            value={value.cardNumber}
            onChange={set("cardNumber")}
            error={errors.cardNumber}
            autoComplete="cc-number"
          />
          <Input
            className="sm:col-span-2"
            label="Name on card"
            value={value.cardName}
            onChange={set("cardName")}
            error={errors.cardName}
            autoComplete="cc-name"
          />
          <Input label="Expiry (MM/YY)" placeholder="08/29" value={value.expiry} onChange={set("expiry")} error={errors.expiry} autoComplete="cc-exp" />
          <Input
            label="CVV"
            type="password"
            inputMode="numeric"
            placeholder="123"
            value={value.cvv}
            onChange={set("cvv")}
            error={errors.cvv}
            autoComplete="cc-csc"
          />
        </div>
      ) : (
        <Input label="UPI ID" placeholder="name@bank" value={value.upiId} onChange={set("upiId")} error={errors.upiId} />
      )}
      <p className="text-xs text-slate-400">This is a demo – no real payment is processed and card details are never stored.</p>
    </fieldset>
  );
}
