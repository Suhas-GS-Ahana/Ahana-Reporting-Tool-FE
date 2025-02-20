import "./globals.css";

export const metadata = {
  title: "Admin - ETL Reporting Tool",
  description: "Admin dashboard for ETL Reporting Tool",
};

export default function AdminLayout({ children }) {
  return (
    <main className="flex-1 p-6 transition-all duration-300 ease-in-out text-xs">
      {children}
    </main>
  );
}
