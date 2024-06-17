include .env
export

COMPOSE_EXEC=docker compose -f ./docker/compose.yaml exec -it
SERVER_EXEC=$(COMPOSE_EXEC) server

BUN_RUN=$(COMPOSE_EXEC) server bun run
ifeq ($(p),host)
	BUN_RUN=bun run
endif

compose-exec:
	$(COMPOSE_EXEC) $(ARGS)

server-exec:
	$(SERVER_EXEC) $(ARGS)

seq:
	$(BUN_RUN) sequelize $(ARGS)

# docker compose
dc:
	docker compose -f ./docker/compose.yaml $(ARGS)

dc-up:
	docker compose -f ./docker/compose.yaml up -d $(ARGS)

dc-down:
	docker compose -f ./docker/compose.yaml down $(ARGS)

dc-prod:
	docker compose -f ./docker/compose.production.yaml $(ARGS)

dc-prod-up:
	docker compose -f ./docker/compose.production.yaml up -d $(ARGS)

dc-prod-down:
	docker compose -f ./docker/compose.production.yaml down $(ARGS)
