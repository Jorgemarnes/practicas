import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';



export const GET = async ({ url }: RequestEvent) => {
    const id = url.searchParams.get('id');

    let query = `SELECT DISTINCT
                    sessions.id,
                    coupons.status,
                    coupons.code, coupons.type,
                    coupons.discount, coupons.max_uses,
                    coupons.infinity_uses,
                    coupons.once_per_session,
                    coupons.once_per_client,
                    coupons.uses,
                    coupons.valid_from,
                    coupons.valid_until
                FROM coupons
                JOIN coupons_sessions
                    ON coupons_sessions.coupon_id = coupons.id
                JOIN sessions
                    ON sessions.id = coupons_sessions.session_id
                WHERE 
                    coupons.valid_from <= NOW()
                AND 
                    coupons.valid_until >= NOW()
                AND 
                    coupons.status = 1`;

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