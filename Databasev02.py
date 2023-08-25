import pandas as pd
import os
import sqlalchemy
from sqlalchemy import create_engine, Column, Integer, String, Float, MetaData, Table

#################################################
# 1. Create trafficdb in local postgresDB first
# 2. Run below code to:
#     a. Read csv file
#     b. Transform data
#     c. Create traffic_data table in trafficdb
#     d. Load table
#################################################

# Establish file path
dpath = 'c:/C_Drive/Bootcamp/Project3/Trafic-Safety-Enhancement/data/'
dbpath = 'Trafic-Safety-Enhancement/'
dfile = 'Real-Time_Traffic_Incident_Reports.csv'
gfile = 'LOCATION_grids_200.geojson'
datapath = os.path.join(dpath, dfile)
gdatapath = os.path.join(dpath, gfile)

# import data from csv
trafficData_df = pd.read_csv(datapath)

# transform data
trafficData_df['issue_reported'] = trafficData_df['issue_reported'].str.upper()
trafficData_df['id'] = trafficData_df.index
trafficData_df.drop(columns=['traffic_report_id'], inplace=True)
trafficData_df['published_date'] = pd.to_datetime(trafficData_df['published_date']).dt.tz_localize(None)
trafficData_df = trafficData_df[['id','published_date','issue_reported','location',
                                'latitude','longitude','address']]

# Remove invalid coordinates
trafficData_df = trafficData_df.loc[~trafficData_df['latitude'].isna() | ~trafficData_df['longitude'].isna()]



# Create connection to local postgres database
engine_url = "postgresql://postgres:postgres@localhost:5432/traffic"
engine = create_engine(engine_url)
conn = engine.connect() 
metadata = MetaData(engine)

# Create table and load data
exist=sqlalchemy.inspect(engine).has_table("traffic_report")
if exist == False:
    trafficData_df.to_sql('traffic_report', engine)
    print("Table loaded")
else:
 print("Table already exists in database")