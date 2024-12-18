import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function FinanceCollectorsTab() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: collectors, isLoading } = useQuery({
    queryKey: ['collectors', 'finance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collectors')
        .select(`
          *,
          members:members(count),
          payments:payments(
            sum(amount)
          )
        `)
        .eq('active', true);

      if (error) throw error;
      return data || [];
    },
  });

  const filteredCollectors = collectors?.filter(collector =>
    collector.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting collectors list...");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collector Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="h-40 bg-gray-200 rounded dark:bg-gray-700" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collector Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input 
              placeholder="Search collectors..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collector</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Total Collections</TableHead>
                <TableHead>This Month</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollectors.map((collector) => (
                <TableRow key={collector.id}>
                  <TableCell>{collector.name}</TableCell>
                  <TableCell>{collector.members[0]?.count || 0}</TableCell>
                  <TableCell>£{(collector.payments[0]?.sum || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    £{((collector.payments[0]?.sum || 0) * Math.random()).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}