import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConsoleOutputProps {
  logs: string[];
}

export const ConsoleOutput = ({ logs }: ConsoleOutputProps) => {
  return (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <CardTitle>Console Output</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="text-sm font-mono whitespace-pre-wrap mb-1"
            >
              {log}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};