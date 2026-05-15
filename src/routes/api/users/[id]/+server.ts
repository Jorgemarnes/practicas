import { json, type RequestEvent } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const GET = async ({ params }: RequestEvent) => {
    try {
        const userId = params.id; // Extraemos el ID de la URL (/api/users/123)
        
        if (!userId) {
            return json({ success: false, error: 'Se requiere un ID' }, { status: 400 });
        }

        // Consultamos un usuario en específico usando WHERE y prepared statement
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [userId]
        );
        
        // rows es un array, si está vacío el usuario no existe
        const users = rows as any[];
        
        if (users.length === 0) {
            return json({
                success: false,
                error: 'Usuario no encontrado'
            }, { status: 404 });
        }
        
        return json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        console.error('Error en la base de datos:', error);
        return json({
            success: false,
            error: 'No se pudo obtener el usuario de la base de datos'
        }, { status: 500 });
    }
};
