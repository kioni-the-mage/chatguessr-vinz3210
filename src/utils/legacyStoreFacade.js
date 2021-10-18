// This file handles storing things in BOTH the old JSON storage
// and in sqlite. Once everything is moved to sqlite we can get rid of this.

const store = require('./sharedStore');

/** @typedef {import('./Database')} Database */

/**
 * 
 * @param {Database} db 
 * @param {string} userId
 * @param {string} username
 * @param {string} displayName
 */
function getOrMigrateUser(db, userId, username, displayName) {
    let dbUser = db.getUser(userId);
    /** @type {import('./sharedStore').LegacyUser} */
    const user = store.get(`users.${username}`);

    if (!dbUser && user) {
        dbUser = db.migrateUser(userId, displayName, user);
        // @ts-ignore
        store.delete(`users.${username}`);
    } else {
        dbUser = db.getOrCreateUser(userId, displayName);
    }

    return { user, dbUser };
}

module.exports = { getOrMigrateUser };