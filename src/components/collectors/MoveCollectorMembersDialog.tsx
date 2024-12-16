import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MoveCollectorMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collector: { id: string; name: string };
  collectors: Array<{ id: string; name: string }>;
  onUpdate: () => void;
}

export function MoveCollectorMembersDialog({
  open,
  onOpenChange,
  collector,
  collectors,
  onUpdate,
}: MoveCollectorMembersDialogProps) {
  const { toast } = useToast();
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch members when dialog opens
  const fetchMembers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('id, full_name, member_number')
      .eq('collector_id', collector.id)
      .order('full_name');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } else {
      setMembers(data || []);
    }
    setIsLoading(false);
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(member => member.id));
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(current =>
      current.includes(memberId)
        ? current.filter(id => id !== memberId)
        : [...current, memberId]
    );
  };

  const handleMoveMembers = async () => {
    if (!selectedCollectorId) {
      toast({
        title: "Error",
        description: "Please select a collector",
        variant: "destructive",
      });
      return;
    }

    if (selectedMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please select members to move",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('members')
      .update({ collector_id: selectedCollectorId })
      .in('id', selectedMembers);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to move members",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `${selectedMembers.length} members have been moved to the selected collector.`,
      });
      onOpenChange(false);
      onUpdate();
    }
    setIsLoading(false);
  };

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (open) {
      fetchMembers();
    } else {
      setSelectedCollectorId("");
      setSelectedMembers([]);
      setMembers([]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Move Members from {collector.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Select onValueChange={setSelectedCollectorId} value={selectedCollectorId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a collector" />
            </SelectTrigger>
            <SelectContent>
              {collectors
                .filter(c => c.id !== collector.id)
                .map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {isLoading ? (
            <div className="text-center py-4">Loading members...</div>
          ) : members.length > 0 ? (
            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedMembers.length === members.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Member Number</TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => handleMemberToggle(member.id)}
                        />
                      </TableCell>
                      <TableCell>{member.member_number}</TableCell>
                      <TableCell>{member.full_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="text-center py-4">No members found for this collector</div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleMoveMembers}
            disabled={isLoading || selectedMembers.length === 0 || !selectedCollectorId}
          >
            Move {selectedMembers.length} Members
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}