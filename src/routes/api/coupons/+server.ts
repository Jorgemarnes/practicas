import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';



export const GET = async ({ url }: RequestEvent) => {

    let query = `SELECT DISTINCT
                    status, code, 
                    coupons.type,
                    discount, 
                    coupons.max_uses,
                    infinity_uses,
                    once_per_session,
                    once_per_client,
                    uses,
                    valid_from,
                    valid_until
                FROM coupons
                WHERE 
                    valid_from <= NOW()
                AND 
                    valid_until >= NOW()
                AND 
                    status = 1`;

    console.log('📨 [GET /api/activities] Petición recibida');
    try {
        console.log('🔍 Ejecutando consulta SQL...');
        const [rows] = await (pool as any).query(query);

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