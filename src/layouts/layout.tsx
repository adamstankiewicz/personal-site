import { Sidebar } from "@/components/sidebar/Sidebar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-16 lg:py-0">
      <div className="lg:flex lg:justify-between lg:gap-0">
        <Sidebar />
        <main className="pt-24 lg:w-[52%] lg:py-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
