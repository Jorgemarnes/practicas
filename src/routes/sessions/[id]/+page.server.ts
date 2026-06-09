import { pool }  from '$lib/server/db';
import type { ActivityResponse } from '$lib/model/activity.model';
import type { RoomConfigResponse } from '$lib/model/room_config.model';
import type { CouponsResponse } from '$lib/model/coupons.model';
import type { SessionsResponse } from '$lib/model/sessions.model';


export const load = async ({ fetch, params }: {fetch:any, params:any}) => {
    try {
        const info_resp = await fetch(`/api/activities?id=${params.id}`);
        const config_resp = await fetch(`/api/rooms?id=${params.id}`);
        const coupons_resp = await fetch(`/api/coupons?id=${params.id}`);
        const sessions_resp = await fetch(`/api/sessions?id=${params.id}`);
        const couponsData: CouponsResponse = await coupons_resp.json();
        const activityData: ActivityResponse = await info_resp.json();
        const roomData: RoomConfigResponse = await config_resp.json();
        const sessionsData: SessionsResponse = await sessions_resp.json();

        return {
            activities: activityData.success ? activityData.data : [],
            room: roomData.success ? roomData.data : [],
            coupons: couponsData.success ? couponsData.data : [],
            sessions: sessionsData.success ? sessionsData.data : [],
            couponsError: couponsData.success ? null : couponsData.error,
            activityError: activityData.success ? null : activityData.error,
            roomError: roomData.success ? null : roomData.error,
            sessionsError: sessionsData.success ? null : roomData.error,
        }
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        return { activities: [], room: [], coupons: [], error: (error as Error).message };
    }
};