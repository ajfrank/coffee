CREATE DATABASE dropcoffee IF NOT EXISTS;

USE dropcoffee;

CREATE TABLE pairings (
	id SERIAL PRIMARY KEY,
	person_one TEXT NOT NULL, 
	person_two TEXT NOT NULL,
	person_three TEXT DEFAULT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now()
);
