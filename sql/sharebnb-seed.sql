-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, zip_code)
VALUES ('testuser1',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'Test1',
    'User1',
    'testuser1@test.com',
    '94601'),
    ('testuser2',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'Test2',
    'User2',
    'testuser2@test.com',
    '94605');

INSERT INTO listings (name, description, max_occupancy, price, zip_code, owner, swimming_pool, pets_allowed)
VALUES ('Test1''s backyard pool!',
        'A large backyard with a large swimming pool!',
        25,
        300,
        '94601',
        'testuser1',
        TRUE,
        TRUE),
        ('Test2''s backyard pool!',
         'A small backyard with a small swimming pool!',
        25,
        200,
        '94605',
        'testuser2',
        TRUE,
        TRUE);
