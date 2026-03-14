import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Field = {
  label: string;
  name: string;
  type?: "text" | "email" | "date" | "number";
  options?: string[];
};

export function QuickActionForm({
  title,
  description,
  fields,
  action,
  submitLabel,
}: {
  title: string;
  description: string;
  fields: Field[];
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label className="space-y-2 text-sm font-medium text-slate-700" key={field.name}>
              <span>{field.label}</span>
              {field.options ? (
                <Select name={field.name} required>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input name={field.name} required type={field.type ?? "text"} />
              )}
            </label>
          ))}
          <div className="md:col-span-2">
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
