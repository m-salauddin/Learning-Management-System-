'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="text-muted-foreground">
                    We encountered an error while loading your dashboard.
                </p>
            </div>
            <div className="flex gap-2">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Page
                </Button>
                <Button onClick={() => reset()}>Try Again</Button>
            </div>
        </div>
    );
}
