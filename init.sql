CREATE TABLE toe (
  ID SERIAL PRIMARY KEY,
  question smallint,
  answer BOOLEAN
);

INSERT INTO toe (question, answer)
VALUES  (0, true);