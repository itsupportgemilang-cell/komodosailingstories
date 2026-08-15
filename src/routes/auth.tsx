import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Studio Sign In | Komodo Tropical Cruise" },
      {
        name: "description",
        content: "Sign in to the Komodo Tropical Cruise content studio to manage journeys.",
      },
      { property: "og:title", content: "Studio Sign In | Komodo Tropical Cruise" },
      {
        property: "og:description",
        content: "Private content studio for the Komodo Tropical Cruise team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setNotice(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/admin", replace: true });
        } else {
          setNotice("Check your email to confirm your account, then sign in.");
        }
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setNotice("Enter your email first, then tap “Forgot password?”.");
      return;
    }
    setResetting(true);
    setNotice(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Reset link sent");
      setNotice("We sent a password reset link to your email. Open it to set a new password.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <p className="eyebrow text-muted-foreground">Komodo Tropical Cruise</p>
        <h1 className="mt-3 text-4xl font-medium">Content studio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to manage journeys, islands and stories."
            : "Create a studio account. An administrator will grant access."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {notice ? (
            <p role="alert" className="text-sm text-destructive">
              {notice}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          {mode === "signin" ? (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetting}
              className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline disabled:opacity-60"
            >
              {resetting ? "Sending reset link…" : "Forgot password?"}
            </button>
          ) : null}
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <button
            type="button"
            className="text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account?" : "Already have an account?"}
          </button>
          <Link to="/" className="text-muted-foreground underline-offset-4 hover:underline">
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}