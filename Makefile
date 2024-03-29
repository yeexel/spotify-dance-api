dev_generate_migrations:
	source .env && TYPEORM_URL=$$DATABASE_URL ./node_modules/ts-node/dist/bin.js ./node_modules/typeorm/cli.js migration:generate -n $(name)

dev_run_migrations:
	source .env && TYPEORM_URL=$$DATABASE_URL ./node_modules/ts-node/dist/bin.js ./node_modules/typeorm/cli.js migration:run

dev_run_migrations_revert:
	source .env && TYPEORM_URL=$$DATABASE_URL ./node_modules/ts-node/dist/bin.js ./node_modules/typeorm/cli.js migration:revert

prod_run_migrations:
	TYPEORM_MIGRATIONS=dist/migrations/**/*.js TYPEORM_MIGRATIONS_DIR=dist/migrations TYPEORM_DRIVER_EXTRA='{ "ssl": true }' TYPEORM_URL=$$DATABASE_URL node ./node_modules/typeorm/cli.js migration:run

start_db:
	docker run -it --name spotify-dance-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:11.2
