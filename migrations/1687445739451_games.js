exports.up = pgm => {
    pgm.createTable('games', {
        id: 'id',
        map: { type: 'varchar(1000)' },
        status: { type: 'smallint', default: 0 },
        order: { type: 'smallint', default: 0 },
        team_one_score: { type: 'smallint', default: 0 },
        team_two_score: { type: 'smallint', default: 0 },
        match: {
            type: 'integer',
            notNull: true,
            references: '"matches"',
            onDelete: 'cascade',
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};
