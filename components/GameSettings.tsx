'use client';

import { useEffect, useState } from 'react';

export default function GameSettings({
  isOwner = false,
}: {
  isOwner: boolean;
}) {
  const [category, setCategory] = useState('Nationals');
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [tossupTime, setTossupTime] = useState(10);

  useEffect(() => {
    const fetchYears = async () => {
      const res = await fetch(`/api/questions/${category.toLowerCase()}`);
      const data = await res.json();
      setYearOptions(data.years);
      setSelectedYear(data.years[0]);
    };

    fetchYears();
  }, [category]);

  if (!isOwner) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Game Settings</h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Category Dropdown */}
        <select
          className="p-2 w-40 rounded-md border transition duration-300"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Nationals">Nationals</option>
          <option value="California" disabled>California (coming soon)</option>
        </select>

        {/* Year Dropdown */}
        <select
          className="p-2 w-28 rounded-md border transition duration-300"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Time Input */}
        <div className="flex items-center gap-1">
          <label className="text-sm text-gray-600">Time for Tossup:</label>
          <input
            type="number"
            min={5}
            max={20}
            value={tossupTime}
            onChange={(e) => setTossupTime(Number(e.target.value))}
            className="w-16 p-2 rounded-md border transition duration-300"
          />
          <span className="text-sm text-gray-500">sec</span>
        </div>
      </div>
    </div>
  );
}
