import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';



export const GET = async ({ url }: RequestEvent) => {
    const id = url.searchParams.get('id');

    let query = `SELECT 
                sessions.id as id,
                activities.description, 
                activities.name as activity_name, 
                activities.ticket_max_session,
                sessions.date_start,
                DAYOFMONTH(sessions.date_start) as day, 
                DAYOFWEEK(sessions.date_start) as dow,
                MONTH(sessions.date_start) as month, 
                YEAR(sessions.date_start) as year,
                parameters.name as public_name,
                places.name as places_name,
                images.url
            FROM activities
                INNER JOIN sessions ON activities.id = sessions.activity_id 
                INNER JOIN places ON sessions.place_id = places.id
                INNER JOIN images ON images.id = (
                SELECT id FROM images WHERE table_id = activities.id LIMIT 1)
                INNER JOIN parameters ON activities.type_public_id = parameters.id 
            WHERE  date_start > NOW()
                AND sessions.hidden = 0
                AND activities.name != 'Demo Realejos'
                AND places.name = 'Teatro Cine Realejos'`;
            
    let params = [];

    if (id) {
        query += ' AND sessions.id = ?';
        params.push(id);
    }
    query += ' ORDER BY date_start ASC;'

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


