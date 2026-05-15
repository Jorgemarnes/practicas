import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';



export const GET_ACTIVITY = async ({ request }: RequestEvent) => {
    console.log('📨 [GET /api/activities] Petición recibida');
    try {
        console.log('🔍 Ejecutando consulta SQL...');
        const [rows] = await pool.query('SELECT activities.* , sessions.date_start FROM activities INNER JOIN sessions ON activities.id = sessions.activity_id WHERE sessions.id = "de9cc2d3-6bc8-446e-95d8-e738a7d40e54"'); 

        console.log('✅ Consulta ejecutada correctamente');
        console.log('📦 Datos obtenidos:', rows);
        console.log('📊 Total de registros:', Array.isArray(rows) ? rows.length : 0);
        
        const response = { success: true, data: rows };
        console.log('📤 Respondiendo con:', JSON.stringify(response).substring(0, 100) + '...');
        
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

export const GET_PRICE = async ({ request }: RequestEvent) => {
    console.log('📨 [GET /api/activities] Petición recibida');
    try {
        console.log('🔍 Ejecutando consulta SQL...');
        const [rows] = await pool.query('SELECT amount FROM price_rates WHERE sessions.id = "de9cc2d3-6bc8-446e-95d8-e738a7d40e54"'); 

        console.log('✅ Consulta ejecutada correctamente');
        console.log('📦 Datos obtenidos:', rows);
        console.log('📊 Total de registros:', Array.isArray(rows) ? rows.length : 0);
        
        const response = { success: true, data: rows };
        console.log('📤 Respondiendo con:', JSON.stringify(response).substring(0, 100) + '...');
        
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


