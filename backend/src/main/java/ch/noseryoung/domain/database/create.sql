/*CREATE DATABASE "recur";*/

CREATE SCHEMA data;

SET search_path TO data;

CREATE TABLE task (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    frequency VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    date_until TIMESTAMP,
    progress DOUBLE PRECISION,
    date_created TIMESTAMP,
    days_in_span INTEGER,
    amount_did INTEGER,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE
);

COPY data.task (
    id,
    name,
    category,
    frequency,
    description,
    date_until,
    progress,
    date_created,
    amount_did,
    is_favorite,
    is_archived
)
FROM '/docker-entrypoint-initdb.d/data.csv' DELIMITER ',' CSV HEADER;