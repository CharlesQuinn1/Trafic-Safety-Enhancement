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
-- Cleaning up the data    
DELETE FROM traffic_report
WHERE
    published_date::timestamp >= '2023-01-01 00:00:00'::timestamp;

DELETE FROM traffic_report
WHERE
    published_date::timestamp <= '2017-12-31 24:00:00'::timestamp;

CREATE TABLE ISSUE_CAT AS
select
 t1.issue_reported
,case
	when 
	upper(t1.issue_reported) like 'TRAFFIC%' OR
	upper(t1.issue_reported) like 'AUTO%' OR
	upper(t1.issue_reported) like 'BLOCK%' OR
	upper(t1.issue_reported) like '%TRFC%' OR
	upper(t1.issue_reported) like 'OBST%'
	then 'OBSTRUCTION'
	when
	upper(t1.issue_reported) like 'COLLI%' OR
	upper(t1.issue_reported) like 'CRASH%' OR
	upper(t1.issue_reported) like 'FLEET%'
	then 'COLLISION'
	when
	upper(t1.issue_reported) like 'COLLI%' OR
	upper(t1.issue_reported) like 'CRASH%' OR
	upper(t1.issue_reported) like 'FLEET%'
	then 'COLLISION'
	when
	upper(t1.issue_reported) like 'HIGH%'
	then 'HIGH WATER'
	when
	upper(t1.issue_reported) like 'ICY%'
	then 'ICY ROADWAY'
	when
	upper(t1.issue_reported) like '%STALL%'
	then 'STALLED VEHICLE'
	when
	upper(t1.issue_reported) like '%BOAT%'
	then 'BOAT ACCIDENT'
	when
	upper(t1.issue_reported) like '%LIVESTOCK%'
	then 'LOOSE LIVESTOCK'
	when
	upper(t1.issue_reported) like '%FIRE%'
	then 'VEHICLE FIRE'
	end as issue_new
from traffic_report t1
group by
 t1.issue_reported
,case
	when 
	upper(t1.issue_reported) like 'TRAFFIC%' OR
	upper(t1.issue_reported) like 'AUTO%' OR
	upper(t1.issue_reported) like 'BLOCK%' OR
	upper(t1.issue_reported) like 'TRFC%' OR
	upper(t1.issue_reported) like 'OBST%'
	then 'OBSTRUCTION'
	when
	upper(t1.issue_reported) like 'COLLI%' OR
	upper(t1.issue_reported) like 'CRASH%' OR
	upper(t1.issue_reported) like 'FLEET%'
	then 'COLLISION'
	when
	upper(t1.issue_reported) like 'HIGH%'
	then 'HIGH WATER'
	when
	upper(t1.issue_reported) like 'ICY%'
	then 'ICY ROADWAY'
	when
	upper(t1.issue_reported) like '%STALL%'
	then 'STALLED VEHICLE'
	when
	upper(t1.issue_reported) like '%BOAT%'
	then 'BOAT ACCIDENT'
	when
	upper(t1.issue_reported) like '%LIVESTOCK%'
	then 'LOOSE LIVESTOCK'
	when
	upper(t1.issue_reported) like '%FIRE%'
	then 'VEHICLE FIRE'
	end
