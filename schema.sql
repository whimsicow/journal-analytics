create table users (
    user_id serial primary key,
    name varchar (200) not null,
    email varchar (200) not null,
    password varchar (50) not null,
    team_id integer references teams
);

create table teams (
    team_id serial primary key,
    team_name varchar (200) not null
);

create table events (
    event_id serial primary key,
    event_date timestamp not null,
    team_id integer references teams
);