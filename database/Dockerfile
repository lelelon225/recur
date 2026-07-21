FROM postgres:16-alpine

ARG POSTGRES_PASSWORD=postgres
ARG POSTGRES_USER=postgres
ARG POSTGRES_DB=recur

ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_DB=${POSTGRES_DB}

COPY create.sql /docker-entrypoint-initdb.d/create.sql
COPY data.csv /docker-entrypoint-initdb.d/data.csv

RUN chmod 644 /docker-entrypoint-initdb.d/create.sql \
    && chmod 644 /docker-entrypoint-initdb.d/data.csv