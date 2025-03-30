import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Add this import
import { Textarea } from "@/components/ui/textarea";

const GenerateImageFromTextSchema = z.object({
  prompt: z.string().min(1).max(1000),
});

const GenerateImageFromText = ({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof GenerateImageFromTextSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof GenerateImageFromTextSchema>>({
    resolver: zodResolver(GenerateImageFromTextSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof GenerateImageFromTextSchema>) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <Textarea {...field} />
            </FormItem>
          )}
        />

        <Button type="submit">Generate</Button>
      </form>
    </Form>
  );
};

export default GenerateImageFromText;
