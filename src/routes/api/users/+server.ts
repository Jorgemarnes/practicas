import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const GET = async ({ request }: RequestEvent) => {
    try {
        // Ejecutamos una consulta SQL simple
        const [rows] = await pool.query('SELECT * FROM users LIMIT 10');
        
        return json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error en la base de datos:', error);
        return json({
            success: false,
            error: 'No se pudieron obtener los usuarios de la base de datos'
        }, { status: 500 });
    }
};

export const POST = async ({ request }: RequestEvent) => {
    try {
        const body = await request.json();
        const { name, email } = body;
        
        if (!name || !email) {
            return json({
                success: false,
                error: 'El nombre y el correo electrónico son obligatorios'
            }, { status: 400 });
        }

        // Ejecutamos una consulta preparada para evitar inyecciones SQL
        const [result] = await pool.execute(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );
        
        return json({
            success: true,
            data: result
        }, { status: 201 });
    } catch (error) {
        console.error('Error en la base de datos:', error);
        return json({
            success: false,
            error: 'No se pudo crear el usuario en la base de datos'
        }, { status: 500 });
    }
};
