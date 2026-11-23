import type { Task, TaskChanges, TokenResponse, User } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (BASE_URL === undefined) throw new Error("NEXT_PUBLIC_API_URL is missing: create .env.local");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token !== undefined) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(BASE_URL + path, { ...init, headers });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: unknown } | null;
    const detail = typeof body?.detail === "string" ? body.detail : `HTTP ${response.status}`;
    throw new ApiError(response.status, detail);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function login(email: string, password: string): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}
export function me(token: string): Promise<User> {
  return request<User>("/auth/me", {}, token);
}
export function listTasks(token: string): Promise<Task[]> {
  return request<Task[]>("/tasks", {}, token);
}
export function getTask(token: string, id: number): Promise<Task> {
  return request<Task>(`/tasks/${id}`, {}, token);
}
export function createTask(token: string, title: string): Promise<Task> {
  return request<Task>("/tasks", { method: "POST", body: JSON.stringify({ title }) }, token);
}
export function updateTask(token: string, id: number, changes: TaskChanges): Promise<Task> {
  return request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(changes) }, token);
}
export function deleteTask(token: string, id: number): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: "DELETE" }, token);
}