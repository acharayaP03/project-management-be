## migrate prisma schema

`npx prisma generate` loads the prisma file

`npx prisma migrate dev --name init` processes the migration

`SELECT setval(pg_get_serial_sequence('"Project"', 'id'), coalesce(max(id)+1, 1), false) FROM "Project";` set auto increment value
