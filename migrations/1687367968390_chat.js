exports.up = pgm => {
    pgm.createTable('chat', {
        id: {
            type: 'serial',
            primaryKey: true,
            notNull: true
        },
        messageType: { type: 'int', notNull: true, default: 0 },
        message: { type: 'varchar(1000)', notNull: true },
        senderName: { type: 'varchar(100)', notNull: true },
        room: { type: 'varchar(100)', notNull: true },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    });
};