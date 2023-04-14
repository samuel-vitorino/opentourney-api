exports.up = pgm => {
    pgm.createTable('tournaments', {
        id: 'id',
        name: { type: 'varchar(1000)', notNull: true },
        avatar: { type: 'varchar(1000)' },
        admin: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        max_teams: { type: 'smallint', notNull: true },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};
