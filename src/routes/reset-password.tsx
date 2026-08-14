import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password | Komodo Tropical Cruise" },
      {
        name: "description",
        content: "Set a new password for your Komodo Tropical Cruise studio account.",
      },
      { property: "og:title", content: "Reset Password | Komodo Tropical Cruise" },
      {
        property: "og:description",
        content: "Set a new password for your Komodo Tropical Cruise studio account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  ssr: false,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else
        setNotice(
          "This reset link is invalid or expired. Request a new one from the sign in page.",
        );
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
        setNotice(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setNotice("Passwords do not match.");
      return;
    }
    setPending(true);
    setNotice(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/admin", replace: true });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <p className="eyebrow text-muted-foreground">Komodo Tropical Cruise</p>
        <h1 className="mt-3 font-serif text-4xl">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a new password for your studio account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          {notice ? (
            <p role="alert" className="text-sm text-destructive">
              {notice}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending || !ready}>
            {pending ? "Please wait…" : "Update password"}
          </Button>
        </form>

        <div className="mt-6 text-sm">
          <Link to="/auth" className="text-muted-foreground underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}