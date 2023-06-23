exports.up = pgm => {
    pgm.createTable('matches', {
        id: 'id',
        manager_id: { type: 'smallint', notNull: true, default: 0 },
        status: { type: 'smallint', default: 0 },
        type: { type: 'smallint', notNull: true, default: 0 },
        currentGame: { type: 'smallint', notNull: true, default: 0 },
        tournament: {
            type: 'integer',
            notNull: true,
            references: '"tournaments"',
            onDelete: 'cascade',
        },
        team_one: {
            type: 'integer',
            notNull: true,
            references: '"teams"',
            onDelete: 'cascade',
        },
        team_two: {
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
