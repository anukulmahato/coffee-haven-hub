import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Hearth & Bean" },
      { name: "description", content: "Espresso, pour-over, fresh pastries — see what's on today at Hearth & Bean." },
      { property: "og:title", content: "Menu — Hearth & Bean" },
      { property: "og:description", content: "Espresso, pour-over, fresh pastries — see what's on today." },
    ],
  }),
  component: MenuPage,
});

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  available: boolean;
};

function MenuPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["menu", "public"],
    queryFn: async (): Promise<Item[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("id,name,description,price,category,available")
        .eq("available", true)
        .order("category")
        .order("name");
      if (error) throw error;
      return data as Item[];
    },
  });

  const byCategory = (data ?? []).reduce<Record<string, Item[]>>((acc, it) => {
    (acc[it.category] ??= []).push(it);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary/70">Today's menu</p>
        <h1 className="mt-3 text-5xl md:text-6xl">Sip slow, eat well.</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Prices in USD. Items rotate with the seasons — if something's missing, it'll be back.
        </p>

        {isLoading && <p className="mt-16 text-muted-foreground">Brewing…</p>}

        <div className="mt-16 space-y-16">
          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="border-b border-border pb-3 text-3xl">{cat}</h2>
              <ul className="mt-6 divide-y divide-border/60">
                {items.map((item) => (
                  <li key={item.id} className="flex items-baseline gap-4 py-5">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-xl font-medium">{item.name}</h3>
                        <span className="flex-1 border-b border-dotted border-border/80" aria-hidden />
                        <span className="font-display text-lg text-primary">${Number(item.price).toFixed(2)}</span>
                      </div>
                      {item.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!isLoading && Object.keys(byCategory).length === 0 && (
            <p className="text-muted-foreground">No items yet — check back soon.</p>
          )}
        </div>
      </section>
    </div>
  );
}
