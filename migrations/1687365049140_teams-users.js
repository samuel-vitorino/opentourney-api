exports.up = pgm => {
    pgm.createTable('teams_users', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        team_id: {
            type: 'integer',
            notNull: true,
            references: '"teams"',
            onDelete: 'cascade',
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};
