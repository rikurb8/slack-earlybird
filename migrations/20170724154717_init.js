
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('Message', (table => {
      table.increments('id').primary();
      table.string('slackId');
      table.string('message');
      table.integer('timestamp');
    }));
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('Message');
};
