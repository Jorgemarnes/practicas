import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';



export const GET = async ({ url }: RequestEvent) => {
    const id = url.searchParams.get('id');

    let query = `SELECT 
                    activities.id,
                    activities.url_youtube,
                    images.url,
                    images_activities.type
                FROM
                    activities
                    INNER JOIN images_activities ON images_activities.activity_id = activities.id
                    INNER JOIN images ON images.id = images_activities.image_id
                    INNER JOIN sessions ON sessions.activity_id = activities.id`
    let params = [];

    if (id) {
        query += ' WHERE sessions.id = ?';
        params.push(id);
    }

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
    }
};