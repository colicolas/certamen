'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

interface LessonProgressDropdownProps {
  userId: string; // Now accepts userId as a prop
  category: string;
  lesson: string;
  initialStatus: 'unstarted' | 'progress' | 'complete';
}

const LessonProgressDropdown: React.FC<LessonProgressDropdownProps> = ({ userId, category, lesson, initialStatus }) => {
  const [status, setStatus] = useState<'unstarted' | 'progress' | 'complete'>(initialStatus);

  const { mutate } = useMutation({
    mutationFn: async (newStatus: 'unstarted' | 'progress' | 'complete') => {
      await axios.put(`/api/user/${userId}/progress`, {
        status: newStatus,
        category,
        lesson,
      });
    },
    onSuccess: (newStatus) => {
      console.log(`Status updated to: ${newStatus}`);
    },
    onError: (error) => {
      console.error('Error updating lesson status:', error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'unstarted' | 'progress' | 'complete';
    setStatus(newStatus);
    mutate(newStatus); // Update the status in the database
  };

  const getStatusColor = (status: 'unstarted' | 'progress' | 'complete') => {
    switch (status) {
      case 'unstarted':
        return 'bg-fuchsia-600 text-white';
      case 'progress':
        return 'bg-blue-500 text-white';
      case 'complete':
        return 'bg-indigo-300 text-black';
      default:
        return 'bg-gray-400 text-black';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={status}
        onChange={handleChange}
        className={`p-2 rounded-md border border-gray-300 ${getStatusColor(status)}`}
      >
        <option value="unstarted" className="bg-beige-300 text-black">
          Unstarted
        </option>
        <option value="progress" className="bg-beige-300 text-black">
          In Progress
        </option>
        <option value="complete" className="bg-beige-300 text-black">
          Completed
        </option>
      </select>
    </div>
  );
};

export default LessonProgressDropdown;
