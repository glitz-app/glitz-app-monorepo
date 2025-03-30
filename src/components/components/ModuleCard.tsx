import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import type { Module, ModuleType } from "@prisma/client";
import { HelpCircle } from "lucide-react";

interface ModuleWithType extends Module {
  type: ModuleType;
}

interface ModuleCardProps {
  module: ModuleWithType;
  collapsed: boolean;
  onOpenSettings: () => void;
}

const ModuleCard = ({ module, collapsed, onOpenSettings }: ModuleCardProps) => {
  return (
    <Card className="relative flex max-w-md flex-col overflow-hidden rounded-xl shadow-md shadow-[#BEBCFF]/10">
      <section
        className="z-20 bg-white p-4 shadow-md shadow-neutral-300 transition-all duration-200 hover:cursor-pointer hover:bg-purple-50 hover:shadow-purple-200"
        onClick={onOpenSettings}
      >
        <h4 className="font-medium">{module.type.name}</h4>
        <div className="absolute right-2 top-2">
          <HoverCard>
            <HoverCardTrigger>
              <HelpCircle
                size={20}
                className="text-neutral-500 hover:text-neutral-700"
              />
            </HoverCardTrigger>
            <HoverCardContent>{module.type.description}</HoverCardContent>
          </HoverCard>
        </div>
        {/* ---- module configuration section ---- */}
        <section></section>
      </section>

      {/* ---- Image results section ---- */}
      <ModuleResults collapsed={collapsed} />
    </Card>
  );
};

const ModuleResults = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <section
      className={cn("z-10 h-48 w-full bg-neutral-200", {
        "h-20": collapsed,
      })}
    ></section>
  );
};

export default ModuleCard;
