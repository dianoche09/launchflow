import { NextResponse } from 'next/server'
import { createServer } from '@/lib/supabase/server'

export async function GET(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    const supabase = createServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = params

    // Verify ownership
    const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single()

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { data: submissions, error } = await supabase
        .from('submissions')
        .select(`
      *,
      platform:platforms(*)
    `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(submissions)
}
