import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Coffee, Leaf, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import heroImg from "@/assets/hero-coffee.jpg";
import beansImg from "@/assets/beans.jpg";
import pourImg from "@/assets/pour.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hearth & Bean — A neighborhood coffee house" },
      { name: "description", content: "Slow-roasted beans, hand-poured espresso, and warm pastries served in a cozy corner of the city." },
      { property: "og:title", content: "Hearth & Bean — A neighborhood coffee house" },
      { property: "og:description", content: "Slow-roasted beans, hand-poured espresso, and warm pastries served in a cozy corner of the city." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" width={1920} height={1280} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/60 to-espresso/20" />
        </div>
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-6 py-24">
          <p className="mb-4 font-display text-sm uppercase tracking-[0.3em] text-accent">Est. 2014 · Small batch</p>
          <h1 className="max-w-2xl text-5xl leading-[1.05] text-cream md:text-7xl">
            Slow coffee for the<br />long mornings.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/85">
            We roast in small batches, pour by hand, and bake everything in-house before sunrise. Pull up a chair — the kettle is on.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/menu">
                See the menu <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-cream/40 bg-transparent text-cream hover:bg-cream/10 hover:text-cream">
              <a href="#visit">Visit the shop Pagee</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.25em] text-primary/70">Our craft</p>
            <h2 className="mt-3 text-4xl md:text-5xl">From green bean to your cup.</h2>
            <p className="mt-6 text-muted-foreground">
              Every bag comes from a farm we've visited and roasters we trust. We cup,
              dial in, and pour with the same care every morning — because the difference
              between good and great is the third sip.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-sm">
              <Stat label="Origins" value="12" />
              <Stat label="Roasts / wk" value="40lb" />
              <Stat label="Regulars" value="900+" />
            </div>
          </div>
          <div className="relative">
            <img src={beansImg} alt="Coffee beans on rustic wood" loading="lazy" width={1200} height={800} className="rounded-lg shadow-2xl shadow-espresso/20" />
            <div className="absolute -bottom-6 -left-6 hidden h-32 w-32 rounded-lg bg-accent md:block" aria-hidden />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="paper-grain border-y border-border/60 bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <Value icon={<Coffee className="h-6 w-6" />} title="Single origin"
              body="Direct trade beans, roasted the week you drink them. Never sitting on a shelf." />
            <Value icon={<Leaf className="h-6 w-6" />} title="Baked in-house"
              body="Croissants laminated at 5am, banana bread still warm at opening." />
            <Value icon={<MapPin className="h-6 w-6" />} title="A real third place"
              body="Big wooden tables, slow wifi, no judgement on a four-hour cappuccino." />
          </div>
        </div>
      </section>

      {/* CTA / Visit */}
      <section id="visit" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <img src={pourImg} alt="Barista pouring latte art" loading="lazy" width={1200} height={800} className="rounded-lg shadow-xl shadow-espresso/20 md:order-2" />
          <div className="md:order-1">
            <p className="font-display text-sm uppercase tracking-[0.25em] text-primary/70">Come by</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Open early. Stay late.</h2>
            <dl className="mt-8 space-y-3 text-base">
              <Row term="Mon–Fri" def="6:30am — 7:00pm" />
              <Row term="Sat–Sun" def="7:30am — 8:00pm" />
              <Row term="Address" def="412 Linden Ave, corner of 5th" />
              <Row term="Phone" def="(415) 555-0142" />
            </dl>
            <Button asChild size="lg" className="mt-10">
              <Link to="/menu">Browse the menu <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-espresso text-cream/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm md:flex-row">
          <p className="font-display text-base text-cream">Hearth &amp; Bean</p>
          <p>© {new Date().getFullYear()} — Brewed with care.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl text-primary">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Value({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/30 text-primary">{icon}</div>
      <h3 className="mt-5 text-2xl">{title}</h3>
      <p className="mt-2 text-muted-foreground">{body}</p>
    </div>
  );
}

function Row({ term, def }: { term: string; def: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 pb-2">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="font-medium">{def}</dd>
    </div>
  );
}
