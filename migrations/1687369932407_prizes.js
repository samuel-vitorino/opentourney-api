exports.up = pgm => {
    pgm.createTable('prizes', {
        id: 'id',
        prize: { type: 'varchar(1000)', notNull: true },
        rank: { type: 'smallint', notNull: true, default: 0 },
        tournament: {
            type: 'integer',
            notNull: true,
            references: '"tournaments"',
            onDelete: 'cascade',
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};
