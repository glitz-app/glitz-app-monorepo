"use client";

import ModuleCard from "@/components/components/ModuleCard";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import React from "react";
import AddModuleContainer from "./AddModuleContainer";
import { api } from "@/trpc/react";
import type { Module, ModuleType } from "@prisma/client";
import ModuleSettingsContainer from "./ModuleSettingsContainer";

export interface ModuleWithType extends Module {
  type: ModuleType;
}

const ModulesContainer: React.FC<{ projectId: string }> = ({ projectId }) => {
  const {
    data: imageProject,
    error,
    isLoading,
    refetch,
  } = api.imageProject.getById.useQuery({ id: projectId });

  const modules = imageProject?.modules;

  const [isAddModuleOpen, setIsAddModuleOpen] = React.useState(false);
  const [selectedModule, setSelectedModule] =
    React.useState<ModuleWithType | null>(null);

  const SIDEBAR_WIDTH = 400;

  const addNewModuleToProject = api.imageProject.addNewModule.useMutation({
    onSuccess: () => {
      // Refetch the modules query
      void refetch();
      setIsAddModuleOpen(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleCloseAddModule = () => {
    setIsAddModuleOpen(false);
  };

  const handleAddModule = (moduleTypeId: string) => {
    addNewModuleToProject.mutate({ imageProjectId: projectId, moduleTypeId });
  };

  const handleOpenModuleSettings = (module: ModuleWithType) => {
    setIsAddModuleOpen(false); // Close AddModuleContainer if it's open
    setSelectedModule(module);
  };

  const handleCloseModuleSettings = () => {
    setSelectedModule(null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="relative h-full w-full">
      <section
        className={cn(
          "scrollbar-hide h-full overflow-y-scroll p-4 transition-all duration-200",
        )}
        style={{
          width:
            isAddModuleOpen || selectedModule
              ? `calc(100% - ${SIDEBAR_WIDTH}px)`
              : "100%",
        }}
      >
        <div className="mx-auto flex max-w-md flex-col">
          {!!modules?.length &&
            modules.map((module: ModuleWithType, index) => (
              <React.Fragment key={module.id}>
                <ModuleCard
                  module={module}
                  collapsed={modules.length - 1 === index ? false : true}
                  onOpenSettings={() => handleOpenModuleSettings(module)} // Add onClick handler
                />
                {index < modules.length - 1 && (
                  <div className="mx-auto h-8 w-[1px] bg-gray-300" />
                )}
              </React.Fragment>
            ))}

          <div className="flex items-center justify-center pt-4">
            <AddModuleButton
              size={"3rem"}
              onClick={() => {
                setSelectedModule(null);
                setIsAddModuleOpen(!isAddModuleOpen);
              }}
            />
          </div>
        </div>
      </section>
      <AddModuleContainer
        open={isAddModuleOpen}
        width={SIDEBAR_WIDTH}
        starter={true}
        onClose={handleCloseAddModule}
        onAddModule={handleAddModule}
      />
      <ModuleSettingsContainer
        key={selectedModule?.id}
        module={selectedModule}
        projectId={projectId}
        width={SIDEBAR_WIDTH}
        onClose={handleCloseModuleSettings}
        onAddModule={handleAddModule}
      />
    </div>
  );
};

export default ModulesContainer;

const AddModuleButton = ({
  size,
  onClick,
}: {
  size: number | string;
  onClick?: () => void;
}) => {
  return (
    <button
      className="group relative cursor-pointer"
      style={{ height: size, width: size }}
      onClick={onClick}
    >
      <div className="absolute left-0 top-0 h-full w-full rotate-45 transform rounded-full bg-gradient-to-r from-[#FFA1FB] via-[#BEBCFF] to-[#7AFFFF] blur-sm transition-all duration-200"></div>
      <div className="absolute left-0 top-0 h-full w-full transform rounded-full border-2 border-white bg-white/70 transition-all duration-200 group-hover:scale-105 group-hover:bg-white/80">
        <PlusIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" />
      </div>
    </button>
  );
};
