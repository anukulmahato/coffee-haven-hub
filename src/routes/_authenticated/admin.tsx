import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Hearth & Bean" }] }),
  component: AdminPage,
});

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
};

type Draft = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  available: boolean;
};

const emptyDraft: Draft = {
  name: "", description: "", price: "", category: "Coffee", image_url: "", available: true,
};

function AdminPage() {
  const { user } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(user?.id);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["menu", "admin"],
    queryFn: async (): Promise<Item[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category").order("name");
      if (error) throw error;
      return data as Item[];
    },
    enabled: !!isAdmin,
  });

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        name: d.name,
        description: d.description || null,
        price: Number(d.price),
        category: d.category,
        image_url: d.image_url || null,
        available: d.available,
      };
      if (d.id) {
        const { error } = await supabase.from("menu_items").update(payload).eq("id", d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menu_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Saved.");
      setOpen(false);
      setDraft(emptyDraft);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Removed.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <p className="mx-auto max-w-6xl px-6 py-20 text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-display text-4xl">Staff only</h1>
          <p className="mt-3 text-muted-foreground">
            Your account doesn't have admin access yet. Ask an owner to grant the <code className="rounded bg-muted px-1.5 py-0.5">admin</code> role.
          </p>
          <Button asChild className="mt-8"><Link to="/menu">Back to menu</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.25em] text-primary/70">Admin</p>
            <h1 className="mt-2 font-display text-4xl">Menu management</h1>
            <p className="mt-2 text-muted-foreground">Add, edit, and pull items from today's menu.</p>
          </div>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setDraft(emptyDraft); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> New item</Button>
            </DialogTrigger>
            <ItemDialog draft={draft} setDraft={setDraft} onSave={() => save.mutate(draft)} busy={save.isPending} />
          </Dialog>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Loading…</TableCell></TableRow>
              )}
              {!isLoading && items.length === 0 && (
                <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No items yet.</TableCell></TableRow>
              )}
              {items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <div className="font-medium">{it.name}</div>
                    {it.description && <div className="text-sm text-muted-foreground">{it.description}</div>}
                  </TableCell>
                  <TableCell>{it.category}</TableCell>
                  <TableCell className="text-right font-display text-primary">${Number(it.price).toFixed(2)}</TableCell>
                  <TableCell>
                    {it.available
                      ? <Badge className="bg-accent/30 text-accent-foreground hover:bg-accent/30">On menu</Badge>
                      : <Badge variant="secondary">Hidden</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => {
                      setDraft({
                        id: it.id, name: it.name, description: it.description ?? "",
                        price: String(it.price), category: it.category,
                        image_url: it.image_url ?? "", available: it.available,
                      });
                      setOpen(true);
                    }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                      if (confirm(`Delete "${it.name}"?`)) del.mutate(it.id);
                    }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function ItemDialog({
  draft, setDraft, onSave, busy,
}: { draft: Draft; setDraft: (d: Draft) => void; onSave: () => void; busy: boolean }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{draft.id ? "Edit item" : "New item"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" type="number" step="0.25" min="0" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="cat">Category</Label>
            <Input id="cat" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Coffee, Tea, Pastry…" />
          </div>
        </div>
        <div>
          <Label htmlFor="img">Image URL (optional)</Label>
          <Input id="img" value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} placeholder="https://…" />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <div>
            <Label htmlFor="avail" className="text-sm">Show on menu</Label>
            <p className="text-xs text-muted-foreground">Hide to take it off without deleting.</p>
          </div>
          <Switch id="avail" checked={draft.available} onCheckedChange={(v) => setDraft({ ...draft, available: v })} />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSave} disabled={busy || !draft.name || !draft.price || !draft.category}>
          {busy ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
