'use client';

import { useState, useEffect } from 'react';

interface FormattedDateProps {
  date: Date;
}

export default function FormattedDate({ date }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleString('tr-TR'));
  }, [date]);
  
  return <span>{formattedDate}</span>;
} 