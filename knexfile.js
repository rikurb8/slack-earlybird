module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'slack-listings',
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