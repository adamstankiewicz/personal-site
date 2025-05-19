import { Link } from "react-router"

export default function NotFound() {
  return (
    <div>
      <h1 className="text-5xl font-bold tracking-tight sm:text-2xl">404 Not Found</h1>
      <Link to="/">Go back to home</Link>
    </div>
  );
}
