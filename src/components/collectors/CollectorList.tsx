import { ScrollArea } from "@/components/ui/scroll-area";
import { CollectorCard } from "./CollectorCard";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

interface CollectorListProps {
  collectors: any[];
  expandedCollector: string | null;
  onToggleCollector: (id: string) => void;
  onEditCollector: (collector: { id: string; name: string }) => void;
  onUpdate: () => void;
  isLoading: boolean;
  searchTerm: string;
}

export function CollectorList({
  collectors,
  expandedCollector,
  onToggleCollector,
  onEditCollector,
  onUpdate,
  isLoading,
  searchTerm,
}: CollectorListProps) {
  const { toast } = useToast();
  const [checkedCollectors, setCheckedCollectors] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Only run checks for collectors we haven't checked yet
    collectors?.forEach(collector => {
      const collectorKey = `${collector.prefix}${collector.number}`;
      if (!checkedCollectors.has(collectorKey)) {
        const totalMembers = collector.members?.length || 0;
        
        // Check for known collector member counts
        const expectedCounts: { [key: string]: number } = {
          'MT05': 168, // Mohammad Tanveer
          'SH09': 90,  // Sahil Hussain
        };

        if (expectedCounts[collectorKey] && totalMembers !== expectedCounts[collectorKey]) {
          console.warn(
            `${collectorKey} - ${collector.name} has ${totalMembers} total members. ` +
            `Expected: ${expectedCounts[collectorKey]}, Got: ${totalMembers}. ` +
            `Missing: ${expectedCounts[collectorKey] - totalMembers} members`
          );

          toast({
            title: "Member Count Mismatch",
            description: `${collector.name} (${collectorKey}) is missing ${expectedCounts[collectorKey] - totalMembers} members`,
            variant: "destructive",
          });

          // Mark this collector as checked
          setCheckedCollectors(prev => new Set([...prev, collectorKey]));
        }
      }
    });

    // Log total members for verification
    const totalMembers = collectors?.reduce((total, collector) => {
      return total + (collector.members?.length || 0);
    }, 0) || 0;
    
    console.log(`Total members across all collectors: ${totalMembers}`);
    
    // Log individual collector counts for debugging
    collectors?.forEach(collector => {
      const activeMembers = collector.members?.filter(m => m.status === 'active' || m.status === null).length || 0;
      const inactiveMembers = collector.members?.filter(m => m.status === 'inactive').length || 0;
      const totalCollectorMembers = collector.members?.length || 0;
      
      console.log(`Collector ${collector.name}:`);
      console.log(`- Total members: ${totalCollectorMembers}`);
      console.log(`- Active members: ${activeMembers}`);
      console.log(`- Inactive members: ${inactiveMembers}`);
    });

  }, [collectors, toast]);

  // Filter collectors based on search term
  const filteredCollectors = collectors?.filter(collector => {
    const matchesName = collector.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNumber = collector.number.includes(searchTerm);
    const matchesPrefix = collector.prefix.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesName || matchesNumber || matchesPrefix;
  }) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading collectors...</div>
      </div>
    );
  }

  if (filteredCollectors.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">
          {searchTerm ? "No collectors found matching your search" : "No collectors found"}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="space-y-4">
        {filteredCollectors.map((collector) => (
          <CollectorCard
            key={collector.id}
            collector={collector}
            collectors={collectors}
            expandedCollector={expandedCollector}
            onToggle={onToggleCollector}
            onEdit={onEditCollector}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </ScrollArea>
  );
}