// @ts-nocheck
import { pool }  from '$lib/server/db';
import type { ActivityInfo } from '$lib/model/activity.model';

export const load = async ({ fetch }: Parameters<ActivityInfo>[0]) => {
    try {
        const response = await fetch('/api/activities');
        const data: ActivityInfo[] = await response.json();

        return {
            activities: data.success ? data.data : [],
            error: data.success ? null : data.error
        }
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        return { activities: [], error: (error as Error).message };
    }
};