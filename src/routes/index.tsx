import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BookOpen, Feather, Images, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Library Readers Association — Home" },
      { name: "description", content: "A community space for editors and authors to store their work and stay motivated." },
      { property: "og:title", content: "Library Readers Association" },
      { property: "og:description", content: "Editors and authors workspace for Poya day and Special day creations." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-95" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-primary-foreground md:py-32">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" /> Stories worth keeping
          </p>
          <h1 className="font-serif text-4xl leading-tight md:text-6xl">
            A calm home for editors<br /> and authors of the LRA
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85">
            Store your work, mark every Poya and special day, and stay motivated together.
            Created by readers, for readers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/our-works">Explore our works</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <Link to="/editor">Editor panel</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-serif text-3xl md:text-4xl">About the Association</h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          The Library Readers Association brings together editors and authors who quietly keep
          reading culture alive. We celebrate every Poya day and every meaningful day on the
          world calendar — through images and words contributed by our members.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: BookOpen, title: "A shared library", body: "Every contribution is stored safely and made browsable for the whole community." },
            { icon: Feather, title: "Authors write", body: "Authors share captions and reflections for special days and Poya days." },
            { icon: Images, title: "Editors design", body: "Editors upload imagery that gives each occasion its own visual voice." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl glass p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-serif text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2">
          <div className="rounded-2xl glass-strong p-8">
            <p className="text-xs uppercase tracking-widest text-primary">Editors</p>
            <h3 className="mt-2 font-serif text-2xl">Upload an image for the day</h3>
            <p className="mt-2 text-sm text-muted-foreground">Pick Poya or Special day, choose the occasion, and add your artwork.</p>
            <Button asChild className="mt-6"><Link to="/editor">Go to Editor Panel</Link></Button>
          </div>
          <div className="rounded-2xl glass-strong p-8">
            <p className="text-xs uppercase tracking-widest text-primary">Authors</p>
            <h3 className="mt-2 font-serif text-2xl">Write a caption or reflection</h3>
            <p className="mt-2 text-sm text-muted-foreground">Choose the day and share words that honour the moment.</p>
            <Button asChild className="mt-6"><Link to="/author">Go to Author Panel</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
