import { SubmissionStatus } from '@/types';
import { cn } from '@/lib/utils';

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
    const styles: Record<SubmissionStatus, string> = {
        pending: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        queued: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        submitted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        approved: 'bg-primary/10 text-primary border-primary/20',
        rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
        failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <span className={cn(
            "px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider",
            styles[status]
        )}>
            {status.replace('_', ' ')}
        </span>
    );
}
