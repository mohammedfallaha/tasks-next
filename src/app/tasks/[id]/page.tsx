"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, getTask } from "@/lib/api";
import { useSession } from "@/lib/session";
import type { Task } from "@/lib/types";

export default function TaskPage() {
  const { id } = useParams<{ id: string }>();
  const { session, ready } = useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (session !== null) getTask(session.token, Number(id)).then(setTask).catch(setError);
  }, [session, id]);

  if (error instanceof ApiError && error.status === 404) notFound(); // shows not-found.tsx
  if (error !== null) return <p className="text-destructive">{error instanceof Error ? error.message : String(error)}</p>;
  if (ready && session === null) return <p>Please <Link href="/login" className="underline">log in</Link> first.</p>;
  if (task === null) return <p>Loading task...</p>;
  return (
    <>
      <h1>{task.title}</h1>
      <p className="my-2 text-muted-foreground">{task.done ? "Done" : "Open"}, task number {task.id}</p>
      <Link href="/tasks" className="underline">Back to the list</Link>
    </>
  );
}