FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install uv && uv pip install --system -r requirements.txt

COPY . .

# Run migrations and start server
CMD ["sh", "-c", "python manage.py makemigrations api && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
