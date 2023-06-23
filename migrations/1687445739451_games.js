exports.up = pgm => {
    pgm.createTable('games', {
        id: 'id',
        connect_ip: { type: 'varchar(1000)' },
        map: { type: 'varchar(1000)' },
        status: { type: 'smallint', notNull: true, default: 0 },
        team_one_score: { type: 'smallint', notNull: true, default: 0 },
        team_two_score: { type: 'smallint', notNull: true, default: 0 },
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
