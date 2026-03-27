'use client';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

interface DataPoint { role: string; score: number; fullName: string; }

interface Props {
  data:         DataPoint[];
  primaryColor: string;
}

export default function RoleFitRadar({ data, primaryColor }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="role" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} tickCount={5} />
        <Radar
          name="Fit Score"
          dataKey="score"
          stroke={primaryColor}
          fill={primaryColor}
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(val) => [`${val}%`, 'Fit Score']}
          contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
