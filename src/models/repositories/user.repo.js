const db = require('../../dbs/init.postgre'); 
const findUserByUserName = async ({ user_name }) => {
    try {
        const query = 'SELECT * FROM Users WHERE user_name = $1';
        const result = await db.query(query, [user_name]);
        return result.rows[0]; 
    } catch (error) {
        throw error;
    }
};

const findUserByEmail = async ({ email }) => {
    try {
        const query = 'SELECT * FROM Users WHERE user_email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0]; 
    } catch (error) {
        throw error;
    }
};

const findUserById = async ({ _id }) => {
    try {
        const query = 'SELECT * FROM Users WHERE id = $1';
        const result = await db.query(query, [_id]);
        return result.rows[0]; 
    } catch (error) {
        throw error;
    }
};

const createUser = async ({ 
    user_slug,
    user_name,
    user_password,
    user_salf,
    user_email,
    user_phone,
    user_gender,
    user_avatar,
    user_date_of_birth,
    user_status,
    user_type 
}) => {
    try {
        const query = `
            INSERT INTO Users 
                (user_slug, user_name, user_password, user_salf, user_email, user_phone, user_gender, user_avatar, user_date_of_birth, user_status, user_type) 
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`;
        const result = await db.query(query, [user_slug, user_name, user_password, user_salf, user_email, user_phone, user_gender, user_avatar, user_date_of_birth, user_status, user_type]);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

module.exports = {
    findUserByUserName, 
    createUser,
    findUserById,
    findUserByEmail
};
