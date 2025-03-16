'use client';

import { useEffect, useRef } from 'react';

interface PaymentIframeProps {
  iframeUrl: string;
  onSuccess?: () => void;
  onFail?: () => void;
}

export default function PaymentIframe({ iframeUrl, onSuccess, onFail }: PaymentIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // PayTR'den gelen mesajları dinle
      if (event.origin === 'https://www.paytr.com') {
        try {
          const data = JSON.parse(event.data);
          if (data.status === 'success') {
            onSuccess?.();
          } else if (data.status === 'failed') {
            onFail?.();
          }
        } catch (error) {
          console.error('PayTR message parsing error:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onFail]);

  return (
    <div className="w-full h-[600px] relative">
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        className="w-full h-full border-0"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      />
    </div>
  );
} 