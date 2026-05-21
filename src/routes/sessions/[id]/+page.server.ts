import { pool }  from '$lib/server/db';
import type { ActivityInfo, ActivityResponse } from '$lib/model/activity.model';

export const load = async ({ fetch, params }: {fetch:any, params:any}) => {
    try {
        const response = await fetch(`/api/activities?id=${params.id}`);
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


