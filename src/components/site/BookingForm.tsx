import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createBookingInquiry } from "@/lib/services/content.functions";

const FIELD =
  "w-full rounded-[1.25rem] border border-border bg-card px-5 py-3.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";
const LABEL = "eyebrow text-muted-foreground";

export function BookingForm({ packageSlug }: { packageSlug?: string }) {
  const submit = useServerFn(createBookingInquiry);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: Record<string, FormDataEntryValue>) =>
      submit({
        data: {
          name: String(values["name"] ?? ""),
          email: String(values["email"] ?? ""),
          whatsapp: String(values["whatsapp"] ?? "") || undefined,
          guests: values["guests"] ? Number(values["guests"]) : undefined,
          preferred_date: String(values["preferred_date"] ?? "") || undefined,
          duration: String(values["duration"] ?? "") || undefined,
          message: String(values["message"] ?? "") || undefined,
          package_slug: packageSlug,
        },
      }),
    onError: (error: Error) => setErrorMessage(error.message),
  });

  if (mutation.isSuccess) {
    return (
      <div className="border border-border p-10 text-center" role="status">
        <p className="text-3xl font-medium">Thank you.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Your enquiry has reached our team in Labuan Bajo. We usually reply within one working
          day.
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-8 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        setErrorMessage(null);
        const formData = new FormData(event.currentTarget);
        mutation.mutate(Object.fromEntries(formData.entries()));
      }}
    >
      <div>
        <label className={LABEL} htmlFor="bf-name">
          Name
        </label>
        <input id="bf-name" name="name" required maxLength={120} className={FIELD} />
      </div>
      <div>
        <label className={LABEL} htmlFor="bf-email">
          Email
        </label>
        <input id="bf-email" name="email" type="email" required className={FIELD} />
      </div>
      <div>
        <label className={LABEL} htmlFor="bf-whatsapp">
          WhatsApp
        </label>
        <input id="bf-whatsapp" name="whatsapp" className={FIELD} />
      </div>
      <div>
        <label className={LABEL} htmlFor="bf-guests">
          Number of Guests
        </label>
        <input id="bf-guests" name="guests" type="number" min={1} max={200} className={FIELD} />
      </div>
      <div>
        <label className={LABEL} htmlFor="bf-date">
          Preferred Date
        </label>
        <input id="bf-date" name="preferred_date" type="date" className={FIELD} />
      </div>
      <div>
        <label className={LABEL} htmlFor="bf-duration">
          Duration
        </label>
        <input
          id="bf-duration"
          name="duration"
          placeholder="e.g. 3 days 2 nights"
          className={FIELD}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="bf-message">
          Message
        </label>
        <textarea id="bf-message" name="message" rows={4} maxLength={2000} className={FIELD} />
      </div>

      {errorMessage ? (
        <p className="text-sm text-destructive sm:col-span-2" role="alert">
          Something went wrong: {errorMessage}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-primary disabled:opacity-50"
        >
          {mutation.isPending ? "Sending…" : "Send Enquiry"}
        </button>
      </div>
    </form>
  );
}