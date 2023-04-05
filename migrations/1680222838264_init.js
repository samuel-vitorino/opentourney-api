exports.up = pgm => {
    pgm.createTable('users', {
        id: 'id',
        name: { type: 'varchar(1000)', notNull: true },
        email: { type: 'varchar(200)', notNull: true, unique: true },
        pwd: { type: 'varchar(200)', notNull: true },
        role: { type: 'smallint', notNull: true },
        avatar: { type: 'varchar(256)' },
        steamid: { type: 'varchar(17)' },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};