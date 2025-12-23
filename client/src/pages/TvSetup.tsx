import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useTvs, useUpdateTv } from "@/hooks/use-tvs";
import { Loader2, Save, Tv2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { type Tv } from "@shared/schema";

export default function TvSetup() {
  const { data: tvs, isLoading } = useTvs();
  const updateTv = useUpdateTv();
  const [editingTv, setEditingTv] = useState<Tv | null>(null);

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8 flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-display font-bold text-foreground">TV Setup</h1>
           <p className="text-muted-foreground">Configure hardware inventory and rules</p>
        </div>
      </header>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground font-display uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Priority</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tvs?.map((tv) => (
                <tr key={tv.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{tv.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{tv.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      tv.priority === "Main" ? "bg-primary/20 text-primary" :
                      tv.priority === "Overflow" ? "bg-slate-700 text-slate-300" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {tv.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${tv.manualOverride ? 'bg-amber-500' : 'bg-green-500'}`} />
                       <span className="text-xs text-muted-foreground">
                         {tv.manualOverride ? "Manual" : "Auto"}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingTv(tv)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit TV Configuration</DialogTitle>
                        </DialogHeader>
                        <TvEditForm tv={tv} onSave={() => setEditingTv(null)} />
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function TvEditForm({ tv, onSave }: { tv: Tv; onSave: () => void }) {
  const updateTv = useUpdateTv();
  const [formData, setFormData] = useState({
    name: tv.name,
    location: tv.location,
    priority: tv.priority || "Secondary",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTv.mutate(
      { id: tv.id, ...formData },
      {
        onSuccess: () => {
          toast({ title: "Updated", description: "TV settings saved." });
          onSave();
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to save settings." });
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Device Name</Label>
        <Input 
          id="name" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          value={formData.location} 
          onChange={e => setFormData({...formData, location: e.target.value})} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">Automation Priority</Label>
        <Select 
          value={formData.priority || "Secondary"} 
          onValueChange={val => setFormData({...formData, priority: val})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Main">Main (Always High Relevance)</SelectItem>
            <SelectItem value="Secondary">Secondary (Standard)</SelectItem>
            <SelectItem value="Overflow">Overflow (Only when busy)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={updateTv.isPending}>
          {updateTv.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
