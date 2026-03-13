import { SubmissionStatus } from '@/types';

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
    const styles: Record<SubmissionStatus, string> = {
        pending: 'bg-muted text-muted-foreground border-muted-foreground/30',
        queued: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
        submitted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
        approved: 'bg-primary/20 text-primary border-primary/50',
        rejected: 'bg-red-500/10 text-red-500 border-red-500/30',
        failed: 'bg-red-500/10 text-red-500 border-red-500/30',
    };

    return (
        <span className={`px-3 py-1 border text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
            {status.toUpperCase().replace('_', ' ')}
        </span>
    );
}
