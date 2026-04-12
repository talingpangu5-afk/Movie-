export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter">Disclaimer</h1>
          <p className="text-muted-foreground">Last Updated: April 10, 2026</p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Content Accuracy</h2>
            <p>
              The information provided on Movie World is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the data provided by third-party APIs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. No Illegal Streaming</h2>
            <p>
              Movie World does NOT host, provide, or promote illegal streaming content. All video content is embedded directly from official sources like YouTube. We do not support or encourage piracy in any form.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. External Links</h2>
            <p>
              Through this website, you are able to link to other websites which are not under the control of Movie World. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Advertising Disclosure</h2>
            <p>
              This website contains advertisements. These ads are provided by third-party networks and we are not responsible for the content or products promoted in these advertisements.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
