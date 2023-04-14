exports.up = pgm => {
    pgm.createTable('matches', {
        id: 'id',
        connect_ip: { type: 'varchar(1000)' },
        map: { type: 'varchar(1000)' },
        status: { type: 'smallint', notNull: true, default: 0 },
        team_1: {
            type: 'integer',
            notNull: true,
            references: '"teams"',
            onDelete: 'cascade',
        },
        team_2: {
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
