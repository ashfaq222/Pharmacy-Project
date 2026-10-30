"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icons";
import { SelectField, TextAreaField, TextField } from "@/components/ui/FormField";
import { districts } from "@/data/districts";
import { CHECKOUT_FIELDS, EMPTY_CHECKOUT, FIELD_LIMITS, cleanCheckout, validateCheckout } from "@/lib/checkout";

const fieldId = (name) => `checkout-${name}`;

function Section({ step, title, description, children }) {
  return (
    <section aria-labelledby={`${fieldId(step)}-title`} className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-mint-50 text-[13px] font-bold text-brand-700 ring-1 ring-mint-100">
          {step}
        </span>
        <div>
          <h2 id={`${fieldId(step)}-title`} className="text-[17px] font-bold tracking-[-0.01em] text-ink-900">
            {title}
          </h2>
          <p className="mt-0.5 text-[13px] text-ink-500">{description}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

/**
 * Customer + delivery form. Validation is derived from the values: a field's
 * error shows once it has been blurred, or for every field after a submit
 * attempt. The submit button lives in the order summary (form={formId}).
 */
export default function CheckoutForm({ formId, onValidSubmit, disabled = false }) {
  const [values, setValues] = useState(EMPTY_CHECKOUT);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validateCheckout(values);
  const visibleError = (name) => (submitted || touched[name] ? errors[name] : undefined);
  const errorCount = Object.keys(errors).length;

  const bind = (name) => ({
    id: fieldId(name),
    name,
    value: values[name],
    error: visibleError(name),
    disabled,
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
    onBlur: () => setTouched((t) => (t[name] ? t : { ...t, [name]: true })),
    ...(FIELD_LIMITS[name] && { maxLength: FIELD_LIMITS[name] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const firstInvalid = CHECKOUT_FIELDS.find((name) => errors[name]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    onValidSubmit(cleanCheckout(values));
  };

  return (
    <form id={formId} noValidate onSubmit={handleSubmit} className="space-y-5" aria-describedby={submitted && errorCount ? `${formId}-errors` : undefined}>
      {submitted && errorCount > 0 && (
        <div id={`${formId}-errors`} role="alert" className="flex gap-2.5 rounded-lg bg-sale/[0.06] p-3.5 text-[13px] leading-relaxed text-sale ring-1 ring-sale/20">
          <Icon name="alert" className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <p>
            <span className="font-semibold">Please check {errorCount === 1 ? "1 field" : `${errorCount} fields`}</span> highlighted below before placing your order.
          </p>
        </div>
      )}

      <Section step="1" title="Customer Information" description="We'll use these details to contact you about your order.">
        <TextField {...bind("fullName")} label="Full Name" autoComplete="name" placeholder="e.g. Ayesha Rahman" className="sm:col-span-2" />
        <TextField
          {...bind("phone")}
          label="Phone Number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01712 345678"
          hint="Bangladeshi mobile number"
        />
        <TextField {...bind("email")} label="Email Address" optional type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" />
      </Section>

      <Section step="2" title="Delivery Information" description="Where should we deliver your order?">
        <SelectField {...bind("district")} label="District" autoComplete="address-level1" placeholder="Select district" options={districts} />
        <TextField {...bind("area")} label="Area / City" autoComplete="address-level2" placeholder="e.g. Dhanmondi" />
        <TextAreaField
          {...bind("address")}
          label="Full Delivery Address"
          autoComplete="street-address"
          placeholder="House / flat, road, block and a nearby landmark"
          className="sm:col-span-2"
        />
        <TextAreaField
          {...bind("instructions")}
          label="Additional Instructions"
          optional
          rows={2}
          placeholder="e.g. Call before delivery, leave with the reception"
          className="sm:col-span-2"
        />
      </Section>
    </form>
  );
}
