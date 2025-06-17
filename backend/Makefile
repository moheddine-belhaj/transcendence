# Backend Makefile

.PHONY: up down clean logs

up:
	@echo "Starting backend services..."
	docker-compose up -d

down:
	@echo "Stopping backend services..."
	docker-compose down

clean:
	@echo "Cleaning backend services..."
	docker-compose down -v --remove-orphans

logs:
	docker-compose logs -f
