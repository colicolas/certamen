'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

interface LessonProgressToggleButtonProps {
  division: string;
  category: string;
  lesson: string;
  initialStatus: 'unstarted' | 'progress' | 'completed';
}

const LessonProgressToggleButton: React.FC<LessonProgressToggleButtonProps> = ({ division, category, lesson, initialStatus }) => {
  const [status, setStatus] = useState<'unstarted' | 'progress' | 'completed'>(initialStatus);

  const toggleStatus = () => {
    switch (status) {
      case 'unstarted':
        return 'progress';
      case 'progress':
        return 'completed';
      case 'completed':
        return 'unstarted';
      default:
        return 'unstarted';
    }
  };

  const { mutate } = useMutation({
    mutationFn: async (newStatus: 'unstarted' | 'progress' | 'completed') => {
      await axios.put(`/api/lessons/${division}/${category}/${lesson}/progress`, {
        status: newStatus,
      });
    },
    onSuccess: (newStatus) => {
      console.log(`Status updated to: ${newStatus}`);
    },
    onError: (error) => {
      console.error('Error updating lesson status:', error);
    },
  });

  const handleClick = () => {
    const newStatus = toggleStatus();
    setStatus(newStatus);
    mutate(newStatus); // Update the status in the database
  };

  const getStatusColor = (status: 'unstarted' | 'progress' | 'completed') => {
    switch (status) {
      case 'unstarted':
        return 'bg-gray-400';
      case 'progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 rounded-md text-white ${getStatusColor(status)}`}
    >
      {status === 'unstarted' && 'Start Lesson'}
      {status === 'progress' && 'Mark as Completed'}
      {status === 'completed' && 'Reset to Unstarted'}
    </button>
  );
};

export default LessonProgressToggleButton;
