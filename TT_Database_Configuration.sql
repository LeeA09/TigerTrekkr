CREATE TABLE public.User (
  userId uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying NOT NULL DEFAULT 'Guest'::character varying UNIQUE,
  totalScore bigint NOT NULL DEFAULT '0'::bigint,
  createdAt timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT User_pkey PRIMARY KEY (userId)
);
CREATE TABLE public.Location (
  locationId numeric NOT NULL,
  name character varying NOT NULL UNIQUE,
  latitude double precision NOT NULL UNIQUE,
  longitude double precision NOT NULL UNIQUE,
  description text NOT NULL,
  imageURL text NOT NULL UNIQUE,
  CONSTRAINT Location_pkey PRIMARY KEY (locationId)
);
CREATE TABLE public.Round (
  roundID uuid NOT NULL DEFAULT gen_random_uuid(),
  userID uuid NOT NULL,
  locationID numeric NOT NULL,
  guessedLat double precision NOT NULL,
  guessedLong double precision NOT NULL,
  distance double precision NOT NULL,
  timeTaken integer NOT NULL,
  difficulty character varying NOT NULL,
  score integer NOT NULL DEFAULT 0,
  createdAt timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT Round_pkey PRIMARY KEY (roundID),
  CONSTRAINT Round_userID_fkey FOREIGN KEY (userID) REFERENCES public.User(userId),
  CONSTRAINT Round_locationID_fkey FOREIGN KEY (locationID) REFERENCES public.Location(locationId)
);
CREATE TABLE public.Session (
  sessionId uuid NOT NULL DEFAULT gen_random_uuid(),
  userID uuid NOT NULL DEFAULT gen_random_uuid(),
  startTime timestamp without time zone NOT NULL DEFAULT now(),
  endTime timestamp without time zone,
  CONSTRAINT Session_pkey PRIMARY KEY (sessionId),
  CONSTRAINT Session_userID_fkey FOREIGN KEY (userID) REFERENCES public.User(userId)
);

-- some Unique and Not Null specifications may need to be altered when importing data for location table
