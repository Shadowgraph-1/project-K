import { useState } from "react";

import { useCreateLlmKeyMutation } from "@/hooks/use-llm-key-query";

import { LlmCreateKeyDialog } from "./LlmCreateKeyDialog";
import { LlmKeysDocsView } from "./LlmKeysDocsView";

export function LlmKeysDocsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [createDialogKey, setCreateDialogKey] = useState(0);
  const [createPresetLabel, setCreatePresetLabel] = useState("");

  const createMutation = useCreateLlmKeyMutation();
  const busy = createMutation.isPending;

  function openCreateDialog(presetLabel = "") {
    setCreatePresetLabel(presetLabel);
    setCreateDialogKey((key) => key + 1);
    setCreateOpen(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col gap-3 px-6 pb-12 pt-4 sm:pt-6">
      <LlmKeysDocsView onCreate={openCreateDialog} />

      <LlmCreateKeyDialog
        key={createDialogKey}
        open={createOpen}
        busy={busy}
        isCreating={createMutation.isPending}
        initialLabel={createPresetLabel}
        onOpenChange={setCreateOpen}
        onCreate={({ label, apiKey }) => {
          createMutation.mutate(
            {
              apiKey,
              ...(label ? { label } : {}),
            },
            {
              onSuccess: () => setCreateOpen(false),
            },
          );
        }}
      />
    </div>
  );
}