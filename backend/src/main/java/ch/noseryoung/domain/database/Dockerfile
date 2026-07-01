FROM postgres:16-alpine

ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=recur

COPY create.sql /docker-entrypoint-initdb.d/create.sql
COPY data.csv /docker-entrypoint-initdb.d/data.csv

RUN chmod 644 /docker-entrypoint-initdb.d/create.sql \
    && chmod 644 /docker-entrypoint-initdb.d/data.csv