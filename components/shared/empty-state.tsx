import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="space-y-2 py-10 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mx-auto max-w-lg text-sm text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}
