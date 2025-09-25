# radius-load-poc (русская версия)

Для английской версии см. [README.md](README.md).

Локальный PoC для нагрузочного тестирования FreeRADIUS с помощью Docker и Go‑клиента (layeh.com/radius). Включает smoke‑тест, генератор нагрузки с управляемым RPS (фазы steady/spike), вывод метрик в NDJSON и парсер итогов.

Темы: radius, freeradius, load-testing, benchmarking, golang, ndjson, docker, docker-compose, radclient, udp, performance, spike-testing

## Требования
- Docker и Docker Compose
- Go 1.22+

## Быстрый старт
- Одноразовая инициализация (создаёт локальный secrets‑файл из примера):
  - `make init`
- Запуск FreeRADIUS:
  - `make up`
  - Логи в отдельном терминале: `make logs`
- Проверка через radclient:
  - `make radclient`
- Smoke‑тест (один Access-Request):
  - `make smoke`
- Нагрузка (steady‑фаза, выводит NDJSON):
  - `make load`
- Парсинг NDJSON в сводку:
  - `make parse`

## Что внутри
- FreeRADIUS с минимальной конфигурацией и файлами пользователей:
  - Клиент `localdev` принимает все IP, общий секрет `testing123`
  - Пользователи:
    - `testuser` / `pass123`
    - `user0000`..`user0999` с паролем `pass123`
- Go‑клиент:
  - Smoke: один Access-Request → ожидается `Access-Accept`
  - Load: генерирует Access-Request с целевым RPS, регулируемым количеством воркеров и таймаутом
  - На каждый запрос печатает NDJSON в stdout с полями:
    - `ts`, `phase`, `latency_ms`, `code`, `err`, `bytes_in`, `bytes_out`
- Docker Compose:
  - Образ `freeradius/freeradius-server:3.2.3`
  - Healthcheck использует `radclient` и ожидает `Access-Accept`
  - Порты: 1812/udp (auth), 1813/udp (acct)

## Настройка RPS/Workers
- Изменяйте `configs/example.env` или экспортируйте переменные окружения:
  - `RPS` (по умолчанию 200)
  - `WORKERS` (по умолчанию 512)
  - `RADIUS_TIMEOUT` (по умолчанию 2s)
  - Длительности фаз: `WARMUP`, `STEADY`, `SPIKE`
  - Множитель спайка: `SPIKE_MULT`
- Для только steady‑фазы: `make load`
- Для только spike‑фазы: `make spike`
- Полная последовательность: `go run ./cmd/load -phase=all | tee logs/all.ndjson`

## Устранение неполадок
- Потери UDP / MTU:
  - На высоких RPS в localhost/bridge возможны потери; временно уменьшите `RPS` или увеличьте `WORKERS`, проверьте настройки сети Docker.
- Несовпадение секретов:
  - При неверном `RADIUS_SECRET` будет `Access-Reject` или таймаут. Секрет в клиенте и `raddb/clients.conf` должен совпадать (`testing123`).
- macOS / WSL и UDP:
  - Возможен троттлинг/джиттер. Повышайте `WORKERS`, снижайте `RPS` или запускайте на Linux.
- Модули FreeRADIUS:
  - Для PoC включены `files` + `pap`. Отключайте EAP/TTLS и прочие, если они не нужны и создают шум.
- Apple Silicon (arm64):
  - В `docker-compose.yml` зафиксирован `platform: linux/amd64` для совместимости образа. Убедитесь, что Docker Desktop поддерживает эмуляцию x86_64.

## Debian VM (на Windows)
- Установка Docker внутри Debian VM:
  - `sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg`
  - `sudo install -m 0755 -d /etc/apt/keyrings`
  - `curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg`
  - `echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release; echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`
  - `sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin`
  - `sudo usermod -aG docker $USER && newgrp docker`

- Клонирование и запуск в VM:
  - `git clone <repo-url> && cd radius-load-poc`
  - `make up && make smoke`
  - `make load && make parse`

- Архитектура CPU:
  - Debian x86_64 VM: работает без изменений.
  - Debian arm64 VM: переопределите платформу, чтобы избежать эмуляции.
    - Создайте локально `docker-compose.override.yml`:
      ```yaml
      services:
        radius:
          platform: linux/arm64
      ```
    - Запуск: `docker compose -f docker-compose.yml -f docker-compose.override.yml up -d --wait`

- Сеть из Windows‑хоста:
  - Рекомендуется Bridge‑адаптер, чтобы Windows напрямую видела IP VM;
  - При NAT — пробросьте UDP‑порты 1812 и 1813 на VM;
  - Откройте файрвол Debian (если включён): `sudo ufw allow 1812/udp && sudo ufw allow 1813/udp`.

- radclient:
  - `make radclient` выполняет `radclient` внутри контейнера; установка на хосте не требуется.

- Производительность в VM:
  - Выделите достаточно vCPU/RAM;
  - Предпочтителен bridge — NAT часто добавляет джиттер/потери для UDP на высоких RPS;
  - Тюньте `RPS`, `WORKERS`, `RADIUS_TIMEOUT` под возможности VM.

## Примечания
- EAP/TTLS и TLS намеренно опущены для простоты PoC.
- NDJSON‑логи складывайте в `logs/` через `tee`.
- Форматирование и анализ кода:
  - `make fmt`
  - `make lint`
 
Примечание по безопасности: в репозитории хранится только `raddb/mods-config/files/authorize.example`.
Реальный файл `authorize` с демо‑учётками создаётся локально `make init` и добавлен в `.gitignore`.
