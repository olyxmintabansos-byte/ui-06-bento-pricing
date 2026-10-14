import { BentoPricing } from "@/components/BentoPricing";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#060913] bento-grid-bg flex flex-col items-center justify-center p-4 sm:p-8">
      <BentoPricing />
    </main>
  );
}
