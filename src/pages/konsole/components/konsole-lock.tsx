import { Panel } from "@/components/ui/panel";
import { useKonsoleAuth } from "@/lib/konsole-auth-context";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/** Full-screen password gate shown until the correct Konsole password is entered. */
export function KonsoleLock() {
  const { t } = useTranslation();
  const { unlock } = useKonsoleAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the field on mount so the user can type the password straight away.
  useEffect(() => inputRef.current?.focus(), []);

  const submit = async () => {
    if (!password || busy) return;
    setBusy(true);
    setError(false);
    const ok = await unlock(password);
    if (!ok) {
      setError(true);
      setPassword("");
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[420px] flex-col justify-center px-4">
      <Panel className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold">🔒 {t("lock.locked")}</div>
          <div className="text-sm text-muted">{t("lock.prompt")}</div>
        </div>

        <input
          ref={inputRef}
          type="password"
          data-testid="lock-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && void submit()}
          placeholder={t("lock.placeholder")}
          className="min-h-[44px] box-border w-full rounded-[10px] border border-white/[0.12] bg-panel-2 px-[14px] text-base text-foreground"
        />

        {error && (
          <div data-testid="lock-error" className="text-sm" style={{ color: "var(--danger)" }}>
            {t("lock.wrong")}
          </div>
        )}

        <button
          type="button"
          data-testid="lock-submit"
          onClick={() => void submit()}
          disabled={busy || !password}
          className="min-h-[44px] cursor-pointer rounded-[10px] px-[18px] text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: "var(--accent)", color: "var(--background)", border: "none" }}
        >
          {busy ? t("lock.checking") : t("lock.unlock")}
        </button>
      </Panel>
    </div>
  );
}
