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
      host: 'postgres',
      database: 'slack-listings',
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};