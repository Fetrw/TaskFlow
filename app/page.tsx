import { Navbar } from "@/components/navbar";
import { Board } from "@/components/board";

export default function Home() {
  return (
    <div className="min-h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Board />
      </main>
    </div>
  );
}
