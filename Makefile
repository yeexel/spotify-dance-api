generate_migrations:
	./node_modules/ts-node/dist/bin.js ./node_modules/typeorm/cli.js migration:generate -n $(name)

run_migrations:
	./node_modules/ts-node/dist/bin.js ./node_modules/typeorm/cli.js migration:run

start_db:
	docker run -it --name spotify-dance-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:11.2

deploy:
	rm -rf ./build
	yarn build
	sh ./scripts/dist.sh
	eb deploy dev
