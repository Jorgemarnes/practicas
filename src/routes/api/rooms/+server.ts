import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';



export const GET = async ({ url }: RequestEvent) => {
    const id = url.searchParams.get('id');

    let query = `SELECT 
                    images.url as room_map,
                    price_rates.amount,
                    room_areas.label,
                    rooms_config.map_info,
                    room_areas.color,
                    room_areas.id
                FROM sessions
                    INNER JOIN rooms_config ON rooms_config.id = sessions.config_id
                    INNER JOIN images_room_config ON images_room_config.rooms_config_id = rooms_config.id
                    INNER JOIN images ON images.id = images_room_config.image_id
                    INNER JOIN price_rates ON price_rates.session_id = sessions.id
                    INNER JOIN room_areas ON room_areas.room_conf_id = rooms_config.id
                WHERE sessions.id = ?;`;
            
        let params = [];
        params.push(id);
    

    console.log('📨 [GET /api/activities] Petición recibida');
    try {
        console.log('🔍 Ejecutando consulta SQL...');
        const [rows] = await (pool as any).query(query, params);
        params = [];

        console.log('✅ Consulta ejecutada correctamente');
        console.log('📦 Datos obtenidos:', rows);
        console.log('📊 Total de registros:', Array.isArray(rows) ? rows.length : 0);
        
        const response = { success: true, data: rows };
        console.log('📤 Respondiendo con:', JSON.stringify(response).substring(0,100000) + '...');
        
        return json(response);
    } catch (error) {
        console.error('❌ Error en la base de datos:', error);
        const errorResponse = {
            success: false,
            error: 'No se pudieron obtener las actividades de la base de datos'
        };
        console.log('📤 Respondiendo con error:', errorResponse);
        
        return json(errorResponse, { status: 500 });
    };

};