'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  isDetailOpen: boolean;
  className?: string;
}

export default function CloseDetailOnClick({
  children,
  isDetailOpen,
  className,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = useCallback(() => {
    if (!isDetailOpen) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete('details');
    router.push(`${pathname}?${params.toString()}`);
  }, [isDetailOpen, router, pathname, searchParams]);

  return (
    <div data-testid="left-column" className={className} onClick={handleClick}>
      {children}
    </div>
  );
}
