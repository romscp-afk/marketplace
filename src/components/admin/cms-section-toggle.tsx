"use client";

import { useTransition } from "react";
import { toggleCmsSection } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import type { CmsSection } from "@/types/admin";

export function CmsSectionToggle({ section }: { section: CmsSection }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleCmsSection(section.id, !section.enabled);
    });
  };

  return (
    <div className="bg-surface flex items-center justify-between rounded-xl border border-border p-4">
      <div>
        <p className="font-medium">{section.title}</p>
        {section.subtitle ? (
          <p className="text-muted text-sm">{section.subtitle}</p>
        ) : null}
        <p className="text-muted mt-1 text-xs">Key: {section.key}</p>
      </div>
      <Button
        size="sm"
        variant={section.enabled ? "secondary" : "primary"}
        isLoading={isPending}
        onClick={handleToggle}
      >
        {section.enabled ? "Disable" : "Enable"}
      </Button>
    </div>
  );
}
