const Browser = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Browser</h1>
      <p className="mt-2">This is the main content area — the rest of the app goes here.</p>

      <section className="grid mt-4 gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {[1,2,3,4].map((n) => (
          <article
            key={n}
            className="bg-white [.dark_&]:bg-black p-4
            rounded-xl shadow-lg shadow-black/20 [.dark_&]:shadow-white/20"
          >
            <h3 className="font-semibold text-lg">Card {n}</h3>
            <p className="text-sm mt-1">Sample content for card {n}. Resize the sidebar to see layout behavior.</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Browser;
