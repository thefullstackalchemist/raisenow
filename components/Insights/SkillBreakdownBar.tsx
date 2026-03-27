'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

interface DataPoint { category: string; score: number; }

interface Props {
  data:         DataPoint[];
  primaryColor: string;
}

const COLORS = ['#2563EB','#7C3AED','#059669','#F59E0B','#DC2626','#6366F1','#0891B2'];

export default function SkillBreakdownBar({ data, primaryColor: _primaryColor }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 90 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} width={88} />
        <Tooltip
          formatter={(val) => [`${val}%`, 'Score']}
          contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }}
        />
        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
