import sqlite3
import pandas as pd

# use pandas to create dataframe based on csv data
trafficData_df = pd.read_csv(r'Real-Time_Traffic_Incident_Reports.csv')

# create a sqlite database and a connection to it
cnxn = sqlite3.connect('traffic.db')
crsr = cnxn.cursor()

# create linechart table with a primary key
create_statement_trafficdata = """CREATE TABLE trafficdata (
traffic_report_id text PRIMARY KEY,
'published_date' text,
'issue_reported' text,
'location' text,
'latitude' text,
'longitude' text,
'address' text,
'status' text,
'status_date' text
);"""
crsr.execute(create_statement_trafficdata)

print(trafficData_df.head())
# # insert your dataframes into that database
# df_linechartdata.to_sql('linechartdata', cnxn, index=False, if_exists="append")
# df_databystatemarch2023.to_sql('databystatemarch2023', cnxn, index=False, if_exists="append")
# df_top5industryannualquitrates.to_sql('top5industryannualquitrates', cnxn, index=False, if_exists="append")

# df_sectorquits.to_sql('sectorquits', cnxn, index=False, if_exists="append")

cnxn.close()

# success! you now have a sqlite database on your computer