import { useState } from 'react';

export function AvatarImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [error, setError] = useState(false);
  const fallbackUrl = 'https://api.dicebear.com/7.x/micah/svg?seed=fallback&backgroundColor=transparent';

  return (
    <img 
      src={error ? fallbackUrl : src} 
      alt={alt} 
      className={className} 
      onError={() => {
        if (!error) {
          console.warn(`Avatar image failed to load: ${src}`);
          setError(true);
        }
      }} 
    />
  );
}
