import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Mail, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Enquiry = Tables<"enquiries">;

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const fetch = async () => {
    const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    setEnquiries(data ?? []);
  };
  useEffect(() => { fetch(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("enquiries").update({ is_read: true }).eq("id", id);
    toast({ title: "Marked as read" }); fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-8">Enquiries / Leads</h1>
      <div className="space-y-4">
        {enquiries.map(e => (
          <div key={e.id} className={`bg-card border rounded-lg p-5 space-y-2 ${!e.is_read ? 'border-primary/40' : 'border-border'}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{e.name}</h3>
                  {!e.is_read && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{e.email} {e.phone && `· ${e.phone}`}</p>
                {e.project_name && <p className="text-xs text-primary mt-1">Re: {e.project_name}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</span>
                {!e.is_read && (
                  <Button variant="ghost" size="icon" onClick={() => markRead(e.id)} title="Mark as read"><Check className="w-4 h-4" /></Button>
                )}
                <a href={`mailto:${e.email}`}><Button variant="ghost" size="icon"><Mail className="w-4 h-4" /></Button></a>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{e.message}</p>
          </div>
        ))}
        {enquiries.length === 0 && <p className="text-center text-muted-foreground py-8">No enquiries yet</p>}
      </div>
    </div>
  );
};

export default AdminEnquiries;
