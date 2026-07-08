"use client";

import { useActionState } from "react";
import { Fish, Lock } from "lucide-react";
import { loginAction } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, {} as { error?: string });

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-3xl glass-strong p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-aqua to-turquoise text-navy">
            <Fish className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-softwhite">
            Happy Aquarium Admin
          </h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage your store</p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              defaultValue="admin@happyaquarium.in"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-softwhite placeholder:text-slate-500 focus:border-aqua/60 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-softwhite placeholder:text-slate-500 focus:border-aqua/60 focus:outline-none"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-aqua to-turquoise px-6 py-3 text-sm font-semibold text-navy transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
