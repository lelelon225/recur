/*CREATE DATABASE "recur";*/

        CREATE SCHEMA data;
        SET search_path TO data;

        CREATE TABLE task (
                id UUID PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR (255) NOT NULL,
                progress DECIMAL(10,2),
                goal VARCHAR(255) NOT NULL,
                description VARCHAR(255),
                date_until DATE,
                date_created TIMESTAMP
        );


        COPY data.task (id, name, category, progress, goal, description, date_until, date_created)
        FROM '/docker-entrypoint-initdb.d/data.csv'
        DELIMITER ','
        CSV HEADER;
