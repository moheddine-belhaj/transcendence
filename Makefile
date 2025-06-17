# Transcendance Project Makefile

.PHONY: all backend frontend clean

# Start all services (backend first, then frontend)
all: backend frontend

# Start only backend service
backend:
	@echo "Starting backend..."
	$(MAKE) -C backend up

# Start only frontend service
frontend:
	@echo "Starting frontend..."
	$(MAKE) -C frontend up

# Stop and clean everything
clean:
	@echo "Cleaning all services..."
	$(MAKE) -C backend clean
	$(MAKE) -C frontend clean
