"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { XIcon } from "lucide-react";
import { ModuleWithType } from "./ModulesContainer";
import GenerateImageFromText from "./ModulesSettings/GenerateImageFromText";

const ModuleSettingsContainer = ({
  module,
  width = 384,
  onAddModule,
  onClose,
  projectId,
}: {
  module: ModuleWithType | null;
  width?: number | string;
  onAddModule?: (moduleTypeId: string) => void;
  onClose?: () => void;
  projectId: string;
}) => {
  const { data: modules, error, isLoading } = api.moduleType.getAll.useQuery();
  const submitModule = api.moduleResult.create.useMutation({
    onSuccess: () => {
      // Refetch the modules query
      // void refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmitModule = (data: { prompt: string }) => {
    console.log(data);

    if (!module) return;

    submitModule.mutate({
      imageProjectId: projectId,
      moduleId: module.id,
      prompt: { input: data.prompt },
    });
  };
  if (isLoading) return <div>Loading...</div>;

  return (
    <div
      className={cn(
        "fixed right-0 top-[60px] h-[calc(100vh-60px)] border-l border-neutral-200 bg-white pt-8 transition-all duration-200 animate-in slide-in-from-right",
        !module && "hidden",
      )}
      style={{ width }}
    >
      <Button
        variant="ghost"
        className="absolute left-2 top-2 h-8 w-8 rounded-full p-0"
        onClick={onClose}
      >
        <XIcon className="h-4 w-4" />
      </Button>
      <div className="w-full p-4">
        <h2 className="mb-4 text-xl font-semibold">{module?.type?.name}</h2>

        {/* GenerateImageFromText */}
        {module?.type?.id === "c89c4301-ff03-4cc3-a254-04d7bfdae7a1" && (
          <GenerateImageFromText onSubmit={handleSubmitModule} />
        )}
      </div>
    </div>
  );
};

export default ModuleSettingsContainer;
