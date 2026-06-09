import type { ActivityInfo, ActivityResponse } from '$lib/model';

export const load = async ({ fetch }: {fetch:any}) => {
    try {
        const response = await fetch('/api/activities');
        const data: ActivityResponse = await response.json();

        return {
            activities: data.success ? data.data : [],
            error: data.success ? null : data.error
        }
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        return { activities: [], error: (error as Error).message };
    }
};