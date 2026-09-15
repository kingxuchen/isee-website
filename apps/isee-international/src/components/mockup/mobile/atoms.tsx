// Small shared bits for the mobile mockups. The brand mark comes from the
// isee-china app. Tile fills are surfaced as `--color-mock-tile-*` tokens.

/** The Isee app mark from the China site. */
export function IseeMark({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/brand/logo.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}

/** A hashed identity tile — one letter on a muted identity fill. */
export function LetterTile({
  letter,
  tone,
}: {
  letter: string;
  tone: "red" | "violet" | "amber" | "teal";
}) {
  return (
    <span
      className={`flex size-[18px] shrink-0 items-center justify-center rounded-[5px] text-[10px] font-semibold text-white ${TILE_TONE[tone]}`}
    >
      {letter}
    </span>
  );
}

const TILE_TONE = {
  red: "bg-mock-tile-red",
  violet: "bg-mock-tile-violet",
  amber: "bg-mock-tile-amber",
  teal: "bg-mock-tile-teal",
} as const;

/** The Isee project tile — white butterfly on the black app plate. */
export function IseeTile() {
  return (
    <span className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-black text-white">
      <IseeMark size={14} />
    </span>
  );
}
