type Props = {
  percentage: number;
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
};

export const LinearProgressBar = ({
  percentage,
  width = 200,
  height = 5,
  strokeWidth = 5,
  className = 'text-orange-500',
}: Props) => {
  const progressWidth = (percentage / 100) * width;

  return (
    <svg width={width} height={height} className={className}>
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="gray"
        rx={height / 2}
        className="stroke-orange-50/50"
      />
      <rect
        x="0"
        y="0"
        width={progressWidth}
        height={height}
        fill="currentColor"
        rx={height / 2}
      />
    </svg>
  );
};

export default LinearProgressBar;
