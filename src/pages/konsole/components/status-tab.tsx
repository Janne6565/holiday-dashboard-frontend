import type { Person } from "@/hooks/useDataInteractions";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { KonsoleLogic } from "../useKonsoleLogic";

export function StatusTab({ logic }: { logic: KonsoleLogic }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-[14px]">
      <PersonCard
        person="janne"
        dot="var(--janne)"
        label={t("status.janneWorks")}
        placeholder={t("status.jannePlaceholder")}
        value={logic.board?.working?.janne ?? ""}
        onSave={logic.setWorking}
      />
      <PersonCard
        person="simon"
        dot="var(--simon)"
        label={t("status.simonWorks")}
        placeholder={t("status.simonPlaceholder")}
        value={logic.board?.working?.simon ?? ""}
        onSave={logic.setWorking}
      />
      <div className="text-[13px] text-muted">{t("status.hint")}</div>
    </div>
  );
}

function PersonCard({
  person,
  dot,
  label,
  placeholder,
  value,
  onSave,
}: {
  person: Person;
  dot: string;
  label: string;
  placeholder: string;
  value: string;
  onSave: (p: Person, text: string) => void;
}) {
  const [local, setLocal] = useState(value);
  const [focused, setFocused] = useState(false);
  // Keep in sync with polled board data, but never clobber what the user is typing.
  useEffect(() => {
    if (!focused) setLocal(value);
  }, [value, focused]);

  return (
    <div className="flex flex-col gap-2 rounded-card border border-white/[0.07] bg-panel p-4">
      <div className="flex items-center gap-2">
        <span className="h-[10px] w-[10px] rounded-pill" style={{ background: dot }} />
        <span className="text-base font-bold">{label}</span>
      </div>
      <input
        data-testid={`working-${person}`}
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onSave(person, local);
        }}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        className="min-h-[44px] box-border rounded-[10px] border border-white/[0.12] bg-panel-2 px-[14px] text-base text-foreground"
      />
    </div>
  );
}
