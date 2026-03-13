export abstract class BaseBot {
    abstract launch(project: any, platform: any): Promise<{ success: boolean; url?: string; error?: string }>
}
