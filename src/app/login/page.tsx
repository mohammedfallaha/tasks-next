"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, login, me } from "@/lib/api";
import { useSession } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const { saveSession } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const { access_token } = await login(email, password);
      const user = await me(access_token);
      saveSession({ token: access_token, user });
      router.push("/tasks"); // like clicking a link to /tasks
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "could not reach the API");
    }
  }

  return (
    <form className="mx-auto flex max-w-sm flex-col gap-3" onSubmit={handleSubmit}>
      <h1>Log in</h1>
      <label>Email<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <Button type="submit">Log in</Button>
      {error !== "" && <p className="text-destructive">{error}</p>}
    </form>
  );
}