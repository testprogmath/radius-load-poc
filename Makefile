SHELL := /bin/bash

# Load env defaults if present
ifneq (,$(wildcard configs/example.env))
include configs/example.env
# Export only lines with VAR=VALUE (ignore comments/blanks)
export $(shell sed -n 's/^\([A-Za-z_][A-Za-z0-9_]*\)=.*/\1/p' configs/example.env)
endif

.PHONY: up down logs smoke load spike parse fmt lint radclient ensure-logs init

ensure-logs:
	mkdir -p logs

up: init
	docker compose up -d --wait

logs:
	docker compose logs -f

down:
	docker compose down -v

smoke:
	go run ./cmd/smoke

load: ensure-logs
	go run ./cmd/load -phase=steady | tee logs/steady.ndjson

spike: ensure-logs
	go run ./cmd/load -phase=spike | tee logs/spike.ndjson

parse:
	cat logs/*.ndjson | go run ./cmd/parse

fmt:
	go fmt ./...

lint:
	go vet ./...

radclient:
	@if command -v radclient >/dev/null 2>&1; then \
	  bash scripts/radclient-auth.sh; \
	else \
	  echo "radclient not found on host; using container..."; \
	  docker compose exec -T radius sh -lc "echo 'User-Name = testuser, User-Password = pass123, NAS-IP-Address = 127.0.0.1' | radclient -sx 127.0.0.1:1812 auth testing123"; \
	fi

init:
	mkdir -p raddb/mods-config/files
	@if [ ! -f raddb/mods-config/files/authorize ]; then \
	  cp raddb/mods-config/files/authorize.example raddb/mods-config/files/authorize; \
	  echo "created raddb/mods-config/files/authorize"; \
	else \
	  echo "raddb/mods-config/files/authorize already exists"; \
	fi
