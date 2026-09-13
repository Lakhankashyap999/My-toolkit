'use client';

import { useState, useEffect } from 'react';
import MissionSnapModal from './MissionSnapModal';

export default function NewUserMissionGate() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      // Check if user has already seen and dismissed the mission note
      const seen = localStorage.getItem('deutschready_mission_seen');
      if (!seen || seen !== 'true') {
        // Smooth 350ms delay so the tool page finishes initial mount
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 350);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  return (
    <MissionSnapModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}
