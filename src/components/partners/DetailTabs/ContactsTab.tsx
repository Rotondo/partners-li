import { useEffect, useState } from "react";
import { PartnerContact } from "@/types/crm";
import { getPartnerContacts, savePartnerContact, deletePartnerContact } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mail, Phone, User, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AddContactDialog } from "../AddContactDialog";
import { Badge } from "@/components/ui/badge";

interface ContactsTabProps {
  partnerId: string;
  onUpdate?: () => void;
}

export const ContactsTab = ({ partnerId, onUpdate }: ContactsTabProps) => {
  const [contacts, setContacts] = useState<PartnerContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await getPartnerContacts(partnerId);
      setContacts(data);
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast.error("Erro ao carregar contatos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [partnerId]);

  const handleDelete = async (contactId: string) => {
    if (!confirm("Deseja realmente excluir este contato?")) return;

    try {
      await deletePartnerContact(contactId);
      await loadContacts();
      onUpdate?.();
      toast.success("Contato excluído com sucesso");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Erro ao excluir contato");
    }
  };

  const handleContactAdded = () => {
    loadContacts();
    onUpdate?.();
    setDialogOpen(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando contatos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contatos ({contacts.length})</h3>
        <Button onClick={() => setDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Contato
        </Button>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum contato cadastrado</p>
            <Button 
              onClick={() => setDialogOpen(true)} 
              variant="outline" 
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Contato
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{contact.name}</CardTitle>
                    {contact.is_primary && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Principal
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                {contact.role && (
                  <p className="text-sm text-muted-foreground">{contact.role}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="hover:underline">
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${contact.phone}`} className="hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.notes && (
                  <p className="text-sm text-muted-foreground mt-2">{contact.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        partnerId={partnerId}
        onSuccess={handleContactAdded}
      />
    </div>
  );
};
