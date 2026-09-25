CREATE TABLE public.user (
  userid uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying NOT NULL DEFAULT 'Guest'::character varying UNIQUE,
  totalscore bigint NOT NULL DEFAULT '0'::bigint,
  createdat timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_pkey PRIMARY KEY (userid)
);
CREATE TABLE public.Location_Image_Info (
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  description text NOT NULL,
  imageName text,
  imageURL text NOT NULL,
  locationId bigint NOT NULL,
  LocationName text,
  CONSTRAINT Location_Image_Info_pkey PRIMARY KEY (locationId)
);
CREATE TABLE public.round (
  userid uuid NOT NULL,
  guessedlat double precision NOT NULL,
  guessedlong double precision NOT NULL,
  distance double precision NOT NULL,
  timetaken integer NOT NULL,
  difficulty character varying NOT NULL,
  roundid uuid NOT NULL DEFAULT gen_random_uuid(),
  score integer NOT NULL DEFAULT 0,
  createdat timestamp without time zone NOT NULL DEFAULT now(),
  locationid bigint NOT NULL,
  CONSTRAINT round_pkey PRIMARY KEY (roundid),
  CONSTRAINT round_userid_fkey FOREIGN KEY (userid) REFERENCES public.user(userid),
  CONSTRAINT round_locationid_fkey FOREIGN KEY (locationid) REFERENCES public.Location_Image_Info(locationId)
);
CREATE TABLE public.session (
  endtime timestamp without time zone,
  sessionid uuid NOT NULL DEFAULT gen_random_uuid(),
  userid uuid NOT NULL DEFAULT gen_random_uuid(),
  starttime timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT session_pkey PRIMARY KEY (sessionid),
  CONSTRAINT session_userid_fkey FOREIGN KEY (userid) REFERENCES public.user(userid)
);

-- some Unique and Not Null specifications were altered when importing data for location table from csv of (data1.json)
