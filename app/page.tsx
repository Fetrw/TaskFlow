import { Navbar } from "@/components/navbar";
import { Board } from "@/components/board";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Board />
      </main>
    </div>
  );
}
