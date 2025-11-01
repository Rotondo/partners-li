import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { savePartnerActivity } from "@/lib/db";
import { toast } from "sonner";
import { ActivityType, ActivityStatus, NewPartnerActivity, PartnerContact } from "@/types/crm";
import { Partner } from "@/types/partner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { getAllPartners, getPartnerContacts } from "@/lib/db";
import { useEffect } from "react";

const activitySchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  partner_id: z.string().optional(),
  contact_id: z.string().optional(),
  activity_type: z.enum(["meeting", "call", "email", "task", "note"]),
  status: z.enum(["scheduled", "completed", "cancelled", "pending"]),
  scheduled_date: z.date().optional(),
  what_discussed: z.string().optional(),
  opportunities: z.string().optional(),
  next_steps: z.string().optional(),
  notes: z.string().optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerId: string | null;
  partnerName: string;
  onSuccess?: () => void;
}

export const AddActivityDialog = ({ 
  open, 
  onOpenChange, 
  partnerId,
  partnerName,
  onSuccess 
}: AddActivityDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [contacts, setContacts] = useState<PartnerContact[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(partnerId);

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      partner_id: partnerId || undefined,
      contact_id: undefined,
      activity_type: "meeting",
      status: "scheduled",
      what_discussed: "",
      opportunities: "",
      next_steps: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      loadPartners();
      if (partnerId) {
        setSelectedPartnerId(partnerId);
        loadContacts(partnerId);
      }
    }
  }, [open, partnerId]);

  useEffect(() => {
    if (selectedPartnerId) {
      loadContacts(selectedPartnerId);
    } else {
      setContacts([]);
    }
  }, [selectedPartnerId]);

  const loadPartners = async () => {
    try {
      const data = await getAllPartners();
      setPartners(data);
    } catch (error) {
      console.error("Error loading partners:", error);
    }
  };

  const loadContacts = async (pId: string) => {
    try {
      const data = await getPartnerContacts(pId);
      setContacts(data);
    } catch (error) {
      console.error("Error loading contacts:", error);
      setContacts([]);
    }
  };

  const onSubmit = async (data: ActivityFormData) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const finalPartnerId = data.partner_id || partnerId;
      if (!finalPartnerId) {
        toast.error("Selecione um parceiro");
        return;
      }

      // Build participants array from contact
      const participants = [];
      if (data.contact_id) {
        const contact = contacts.find(c => c.id === data.contact_id);
        if (contact) {
          participants.push({
            name: contact.name,
            role: contact.role,
            contact_id: contact.id,
          });
        }
      }

      const newActivity: NewPartnerActivity = {
        partner_id: finalPartnerId,
        user_id: user.id,
        title: data.title,
        activity_type: data.activity_type as ActivityType,
        status: data.status as ActivityStatus,
        scheduled_date: data.scheduled_date,
        what_discussed: data.what_discussed,
        opportunities: data.opportunities,
        next_steps: data.next_steps,
        notes: data.notes,
        participants,
      };

      await savePartnerActivity(newActivity);
      
      toast.success("Atividade adicionada com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error("Erro ao adicionar atividade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {partnerId ? `Nova Atividade - ${partnerName}` : "Nova Atividade"}
          </DialogTitle>
          <DialogDescription>
            Registre reuniões, ligações, emails e outras interações
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!partnerId && (
              <FormField
                control={form.control}
                name="partner_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parceiro *</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedPartnerId(value);
                        form.setValue("contact_id", undefined);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o parceiro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(selectedPartnerId || partnerId) && contacts.length > 0 && (
              <FormField
                control={form.control}
                name="contact_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o contato (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} {contact.role ? `- ${contact.role}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Reunião de alinhamento comercial" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="activity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="meeting">Reunião</SelectItem>
                        <SelectItem value="call">Ligação</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="task">Tarefa</SelectItem>
                        <SelectItem value="note">Nota</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Agendada</SelectItem>
                        <SelectItem value="completed">Concluída</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduled_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="what_discussed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>O que discutimos</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Principais pontos discutidos..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="opportunities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oportunidades</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} placeholder="Oportunidades identificadas..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próximos Passos</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} placeholder="Ações e próximos passos..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionais</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} placeholder="Observações extras..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Adicionar Atividade"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
