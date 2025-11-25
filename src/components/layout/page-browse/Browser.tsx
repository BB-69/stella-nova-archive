const Browser = () => {
  return (
    <div className="browser">
      <h1>Welcome</h1>
      <p>This is the main content area — the rest of the app goes here.</p>

      <section className="cards">
        {[1, 2, 3, 4].map((n) => (
          <article key={n} className="card">
            <h3>Card {n}</h3>
            <p>
              Sample content for card {n}. Resize the sidebar to see layout
              behavior.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Browser;
