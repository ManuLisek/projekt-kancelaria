export default function Home() {
  return (
    <main className="min-h-dvh bg-stone-50 text-zinc-950">
      <section className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
          Nowy projekt
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
          Kancelaria Adwokacka
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
          Czysta baza pod szybka strone wizytowke z blogiem, specjalizacjami i
          tresciami zarzadzanymi w Sanity.
        </p>
        <div className="mt-10 grid gap-4 text-sm text-zinc-700 sm:grid-cols-3">
          <div className="border-l border-amber-700 pl-4">
            Next.js 16, React 19 i TypeScript strict.
          </div>
          <div className="border-l border-amber-700 pl-4">
            Sanity jako edytowalne zrodlo tresci.
          </div>
          <div className="border-l border-amber-700 pl-4">
            Przygotowane pod wdrozenie na Vercel.
          </div>
        </div>
      </section>
    </main>
  );
}
