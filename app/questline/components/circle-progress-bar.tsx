'use client';
import 'react-circular-progressbar/dist/styles.css';

type Props = {
  percentage: number;
};

export const CircleProgressBar = ({ percentage }: Props) => {
  const radius = 50;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      className="transform -rotate-90"
    >
      <circle
        stroke="currentColor"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="text-orange-50/50"
      />
      <circle
        stroke="currentColor"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="text-orange-500"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        transform={`rotate(90, ${radius}, ${radius})`}
        className="text-xl font-bold text-orange-500"
        fill="currentColor"
      >
        {percentage}%
      </text>
    </svg>
  );
};
