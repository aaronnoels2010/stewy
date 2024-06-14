-- Leeg de bestaande tabellen
TRUNCATE TABLE td_volunteer CASCADE;
TRUNCATE TABLE td_club CASCADE;

-- Voeg data toe
INSERT INTO td_club (id, name)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Science Club'),
       ('4a1c5db2-6a23-4c3a-99f1-d2c72d21e8c7', 'Literature Club');

INSERT INTO td_volunteer (id, first_name, last_name, club_id)
VALUES ('c56a4180-65aa-42ec-a945-5fd21dec0538', 'Alice', 'Johnson', NULL),
       ('456aa32b-53e3-43f5-b1b1-2853fa13b7b6', 'Bob', 'Smith', NULL),
       ('b51e4652-3b22-11e7-9394-002590b8c14d', 'Charlie', 'Brown', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
       ('a74c3d3f-3b22-11e7-9394-002590b8c14d', 'Daisy', 'Miller', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
       ('d64b434b-3b22-11e7-9394-002590b8c14d', 'Eve', 'Davis', '4a1c5db2-6a23-4c3a-99f1-d2c72d21e8c7'),
       ('c56a4180-3b22-11e7-9394-002590b8c14d', 'Frank', 'Moore', '4a1c5db2-6a23-4c3a-99f1-d2c72d21e8c7');

UPDATE td_club
SET responsible_id = 'c56a4180-65aa-42ec-a945-5fd21dec0538'
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
UPDATE td_club
SET responsible_id = '456aa32b-53e3-43f5-b1b1-2853fa13b7b6'
WHERE id = '4a1c5db2-6a23-4c3a-99f1-d2c72d21e8c7';
