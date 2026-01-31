import MonitorForm from '@/components/MonitorForm';
import DashboardTable from '@/components/DashboardTable';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-cyan-400 py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink neon-text-glow sm:text-5xl tracking-widest uppercase">
            API Health Monitor
          </h1>
          <p className="mt-4 text-lg text-fuchsia-300 neon-pink-text-glow">
            Configure health checks and monitor your API endpoints in real-time.
          </p>
        </div>

        <MonitorForm />

        <DashboardTable />
      </div>
    </main>
  );
}
