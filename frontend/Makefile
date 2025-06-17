# Frontend Makefile

.PHONY: up down clean logs

up:
	@echo "Starting frontend services..."
	docker-compose up -d

down:
	@echo "Stopping frontend services..."
	docker-compose down

clean:
	@echo "Cleaning frontend services..."
	docker-compose down -v --remove-orphans

logs:
	docker-compose logs -f
