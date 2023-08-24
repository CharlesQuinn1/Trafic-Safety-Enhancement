-- Table: public.traffic_report

-- DROP TABLE IF EXISTS public.traffic_report;

CREATE TABLE IF NOT EXISTS public.traffic_report
(
    report_id text COLLATE pg_catalog."default" NOT NULL,
    published_date timestamp without time zone,
    issue_reported text COLLATE pg_catalog."default",
    location text COLLATE pg_catalog."default",
    latitude double precision,
    longitude double precision,
    address text COLLATE pg_catalog."default",
    status text COLLATE pg_catalog."default",
    status_date timestamp without time zone,
    CONSTRAINT traffic_report_pkey PRIMARY KEY (report_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.traffic_report
    OWNER to postgres;