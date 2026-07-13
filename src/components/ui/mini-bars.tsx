interface MiniBarsProps {
  values: number[];
  color: string;
}

/** 7-day token sparkline. Bar heights are relative to the max, as in the design. */
export function MiniBars({ values, color }: MiniBarsProps) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-[38px] items-end gap-[5px]">
      {values.map((v, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length 7-day series
          key={i}
          className="flex-1 rounded-t-[3px]"
          style={{ background: color, height: Math.round((v / max) * 32) + 5 }}
        />
      ))}
    </div>
  );
}
