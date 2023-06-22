exports.up = pgm => {
    pgm.createTable('tournaments_teams', {
        id: 'id',
        tournament: {
            type: 'integer',
            notNull: true,
            references: '"tournaments"',
            onDelete: 'cascade',
        },
        team: {
            type: 'integer',
            notNull: true,
            references: '"teams"',
            onDelete: 'cascade',
        },
        joinedAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};
