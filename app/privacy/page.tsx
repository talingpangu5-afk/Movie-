export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: April 10, 2026</p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
            <p>
              Taling Pangu is designed to be a privacy-first platform. We do not require user registration or personal information to browse our content. We may collect non-personally identifiable information such as browser type, device information, and usage patterns to improve our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Cookies and Tracking</h2>
            <p>
              We use cookies to enhance your browsing experience and analyze site traffic. Our advertising partners, such as Adsterra, may also use cookies to serve personalized advertisements based on your interests.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Third-Party Services</h2>
            <p>
              Our website links to third-party services like YouTube (for trailers) and TMDb (for data). These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Advertising</h2>
            <p>
              We use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
