const db = require('../../dbs/init.postgre');

const createOrUpdateToken = async ({ user_id, privateKey, publicKey, refreshToken }) => {
    try {
        const existingKey = await findKeyByUserId({ user_id });

        if (existingKey) {
            const query = `
                UPDATE Keys 
                SET public_key = $1, private_key = $2, refresh_token = $3 
                WHERE user_id = $4
                RETURNING *`;
            const result = await db.query(query, [publicKey, privateKey, refreshToken, user_id]);
            return result.rows[0];
        } else {
            const query = `
                INSERT INTO Keys (user_id, public_key, private_key, refresh_token) 
                VALUES ($1, $2, $3, $4) 
                RETURNING *`;
            const result = await db.query(query, [user_id, publicKey, privateKey, refreshToken]);
            return result.rows[0];
        }
    } catch (error) {
        throw error;
    }
}

const findKeyByUserId = async ({ user_id }) => {
    try {
        console.log(user_id)
        const query = 'SELECT * FROM Keys WHERE user_id = $1';
        const result = await db.query(query, [user_id]);
        return result.rows[0]; 
    } catch (error) {
        throw error;
    }
};

const updateKeyToken = async ({ id, privateKey, publicKey, refreshToken }) => {
    try {
        const key = await findKeyByUserId({ _id: id });
        
        if (!key) {
            return null; 
        }

        const query = `
            UPDATE Keys 
            SET public_key = $1, private_key = $2, refresh_token = $3 
            WHERE id = $4
            RETURNING *`;
        const result = await db.query(query, [publicKey, privateKey, refreshToken, id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const deleteKeyToken = async ({ user_id }) => {
    try {
        const key = await findKeyByUserId({ user_id });

        if (!key) {
            return null; 
        }

        const query = `
            DELETE FROM Keys 
            WHERE user_id = $1
            RETURNING *`;
        const result = await db.query(query, [user_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const addKeyTokenToTokenUseds = async ({ user_id, refreshToken }) => {
    try {
        const query = `
                INSERT INTO refreshtokens (key_id, refresh_token) 
                VALUES ($1, $2) 
                RETURNING *`;
        const result = await db.query(query, [ user_id, refreshToken]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const getTokenUsedsByKeyId = async ({key_id}) => {
    try {
        const query = `
            SELECT refresh_token 
            FROM Refreshtokens 
            WHERE key_id = $1`;
        const result = await db.query(query, [key_id]);
        return result.rows.map(row => row.refresh_token);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createOrUpdateToken,
    findKeyByUserId,
    updateKeyToken,
    deleteKeyToken,
    addKeyTokenToTokenUseds,
    getTokenUsedsByKeyId
};
