import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';



export const GET = async ({ request }: RequestEvent) => {
    console.log('📨 [GET /api/activities] Petición recibida');
    try {
        console.log('🔍 Ejecutando consulta SQL...');
        const [rows] = await pool.query(`SELECT activities.description, activities.name as activity_name, sessions.date_start,
            DAYOFMONTH(sessions.date_start) as day, 
            DAYOFWEEK(sessions.date_start) as dow, MONTH(sessions.date_start) as month, 
            YEAR(sessions.date_start) as year,
            parameters.name as public_name, price_rates.amount, places.name FROM activities
            INNER JOIN sessions ON activities.id = sessions.activity_id 
            INNER JOIN parameters ON activities.type_public_id = parameters.id 
            INNER JOIN price_rates ON sessions.id = price_rates.session_id
            INNER JOIN places ON sessions.place_id = places.id
            WHERE sessions.id = "de9cc2d3-6bc8-446e-95d8-e738a7d40e54"`); 

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


