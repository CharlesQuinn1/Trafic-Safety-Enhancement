import sqlite3
import pandas as pd

# use pandas to create dataframe based on csv data
trafficData_df = pd.read_csv(r'Real-Time_Traffic_Incident_Reports.csv')

# create a sqlite database and a connection to it
cnxn = sqlite3.connect('traffic.sqlite')
crsr = cnxn.cursor()

# # drop table if it exists and recreate
cnxn.execute("drop table trafficdata") 
# cnxn.commit()

# create linechart table with a primary key
create_statement_trafficdata = """CREATE TABLE trafficdata (
'traffic_report_id' text PRIMARY KEY,
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

# insert your dataframes into that database
trafficData_df.to_sql('trafficdata', cnxn, index=False, if_exists="append")
cnxn.commit()

cnxn.close()

# success! you now have a sqlite database on your computer