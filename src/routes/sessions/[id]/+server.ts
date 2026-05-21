import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const GET = async ({ request }: RequestEvent, {id}: { id: string }) => {
    try {
        console.log('🔍 Ejecutando consulta SQL...');
        const [rows] = await pool.query(`SELECT activities.description, activities.name as activity_name, sessions.date_start,
            DAYOFMONTH(sessions.date_start) as day, 
            DAYOFWEEK(sessions.date_start) as dow, MONTH(sessions.date_start) as month, 
            YEAR(sessions.date_start) as year,
            parameters.name as public_name, price_rates.amount, places.name as places_name, images.url FROM activities
            INNER JOIN sessions ON activities.id = sessions.activity_id 
            INNER JOIN parameters ON activities.type_public_id = parameters.id 
            INNER JOIN price_rates ON price_rates.id = (
            SELECT id FROM price_rates WHERE session_id = sessions.id LIMIT 1
            )
            INNER JOIN places ON sessions.place_id = places.id
            INNER JOIN images ON images.id = (
            SELECT id FROM images WHERE table_id = activities.id LIMIT 1
            )
            WHERE  date_start > NOW() AND sessions.id = ${id}`);
    } catch (error) {
        console.error('❌ Error en la base de datos:', error);
        const errorResponse = {
            success: false,
            error: 'No se pudieron obtener las actividades de la base de datos'
        };
        console.log('📤 Respondiendo con error:', errorResponse);
    }};