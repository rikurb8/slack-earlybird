module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './slack-listings.db'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'slack-listings'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};