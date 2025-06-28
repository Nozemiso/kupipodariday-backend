export default () => ({
  port: process.env.PORT || 3001,
  jwt: process.env.JWT_SECRET || 'asdasdsadasdsa',
  database: {
    url: process.env.DATABASE_URL || 'postgres',
    port: process.env.DATABASE_PORT || 5432,
  },
});
