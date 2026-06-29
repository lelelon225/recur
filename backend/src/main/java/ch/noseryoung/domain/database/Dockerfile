FROM postgres:16-alpine
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=recur
COPY create.sql /docker-entrypoint-initdb.d/
COPY data.csv /docker-entrypoint-initdb.d/
