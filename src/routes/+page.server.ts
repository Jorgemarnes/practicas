import { pool }  from '$lib/server/db';

export const load = async ({ fetch }) => {
    try {
        const response = await fetch('/api/activities');
        const data = await response.json();

        return {
            activities: data.success ? data.data : [],
            error: data.success ? null : data.error
        }
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        return { activities: [], error: (error as Error).message };
    }
};