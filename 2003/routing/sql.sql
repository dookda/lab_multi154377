let houses = [
    { id: 1, address: '123 Main St', owner: 'John Doe' },
    { id: 2, address: '456 Maple Ave', owner: 'Jane Smith' },
];

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

CREATE TABLE houses
(
    id serial NOT NULL,
    address character varying(254),
    owner character varying(254),
    loc geometry(Point,4326),
    CONSTRAINT houses_pkey PRIMARY KEY (id)
)

INSERT INTO houses (address, owner, loc) VALUES ('123 Main St', 'John Doe', ST_GeomFromText('POINT(98.95012839563981 18.80283370985771, 4326)');
INSERT INTO houses (address, owner, loc) VALUES ('456 Maple Ave', 'Jane Smith', ST_GeomFromText('POINT(98.96761506873483 18.801999382705816, 4326)');

CREATE TABLE users
(
    id serial NOT NULL,
    name character varying(254),
    email character varying(254),
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');
INSERT INTO users (name, email) VALUES ('Jane Smith', 'jane@example.com');