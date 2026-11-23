import Link from "next/link"; 
 export default function NotFound() { return <><h1>Task not found</h1><Link href="/tasks" className="underline">Back to the list</Link></>; }