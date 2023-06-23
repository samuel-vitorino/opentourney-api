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
        organizer: { type: 'varchar(1000)', notNull: true },
        information: { type: 'varchar(2000)', notNull: true },
        status: { type: 'smallint', notNull: true, default: 0 },
        stages: { type: 'smallint', notNull: true },
        current_stage: { type: 'smallint', notNull: true, default: 0 },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};
