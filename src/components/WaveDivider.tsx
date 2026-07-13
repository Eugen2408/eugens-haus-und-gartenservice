// Weicher, organischer Übergang zwischen dunklen und hellen Sektionen.
// Die gefüllte Fläche liegt unten (wellige Oberkante); `fill` bestimmt ihre
// Farbe über currentColor (z. B. "text-white"). `flip` dreht die Welle, sodass
// die gefüllte Fläche oben liegt (für den Übergang in einen dunklen Footer).
export default function WaveDivider({
  fill = "text-white",
  flip = false,
  className = "",
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full overflow-hidden leading-[0] ${className}`}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className={`block h-[55px] w-full sm:h-[80px] ${fill} ${flip ? "rotate-180" : ""}`}
      >
        <path
          fill="currentColor"
          d="M0,52 C360,92 1080,8 1440,48 L1440,90 L0,90 Z"
        />
      </svg>
    </div>
  );
}
