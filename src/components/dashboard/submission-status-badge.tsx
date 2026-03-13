import { SubmissionStatus } from '@/types'

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
    const styles: Record<SubmissionStatus, string> = {
        pending: 'bg-gray-100 text-gray-800',
        queued: 'bg-blue-100 text-blue-800',
        submitted: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        failed: 'bg-red-100 text-red-800',
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
            {status.toUpperCase()}
        </span>
    )
}
