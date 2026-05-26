import { pool }  from '$lib/server/db';
import type { ActivityInfo, ActivityResponse } from '$lib/model/activity.model';
import type { RoomConfig, RoomConfigResponse } from '$lib/model/room_config.model';

export const load = async ({ fetch, params }: {fetch:any, params:any}) => {
    try {
        const info_resp = await fetch(`/api/sessions?id=${params.id}`);
        const config_resp = await fetch(`/api/sessions?id=${params.id}`);
        const activityData: ActivityResponse = await info_resp.json();
        const roomData: RoomConfigResponse = await config_resp.json();

        return {
            activities: activityData.success ? activityData.data : [],
            room: roomData.success ? roomData.data : [],
            activityError: activityData.success ? null : activityData.error,
            roomError: roomData.success ? null : roomData.error
        }
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        return { activities: [], error: (error as Error).message };
    }
};


