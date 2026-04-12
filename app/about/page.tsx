export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
      <div className="space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">About Movie World</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your premier destination for everything cinema.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Movie World was founded with a simple goal: to provide movie enthusiasts with a clean, modern, and highly responsive platform to discover and explore the world of cinema. Whether you&apos;re looking for the latest blockbusters, hidden indie gems, or all-time classics, we&apos;ve got you covered.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Powered by TMDb</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our data is powered by The Movie Database (TMDb). This product uses the TMDb API but is not endorsed or certified by TMDb. We leverage their extensive database to bring you accurate information about movies, TV shows, cast members, and more.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">What We Offer</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
              {[
                "Real-time trending & popular movies",
                "Detailed movie information & ratings",
                "High-quality trailers & video content",
                "Comprehensive cast & crew details",
                "Powerful search functionality",
                "Modern, responsive user interface"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-secondary/30 p-4 rounded-lg border border-muted/20">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
