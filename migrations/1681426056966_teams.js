exports.up = pgm => {
    pgm.createTable('teams', {
        id: 'id',
        name: { type: 'varchar(1000)', notNull: true },
        avatar: { type: 'varchar(1000)' },
        owner: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};
