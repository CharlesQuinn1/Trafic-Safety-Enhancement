import pandas as pd
import os
import sqlalchemy
from sqlalchemy import create_engine, Column, Integer, String, Float, MetaData, Table

#####################################
# Create trafficdb in postgres first
#####################################

dpath = 'Trafic-Safety-Enhancement/data/'
dbpath = 'Trafic-Safety-Enhancement/'
dfile = 'Real-Time_Traffic_Incident_Reports.csv'
gfile = 'LOCATION_grids_200.geojson'
datapath = os.path.join(dpath, dfile)
gdatapath = os.path.join(dpath, gfile)

# import data from csv
trafficData_df = pd.read_csv(datapath)
trafficData_df['issue_reported'] = trafficData_df['issue_reported'].str.upper()
trafficData_df['id'] = trafficData_df.index
trafficData_df.drop(columns=['traffic_report_id'], inplace=True)
trafficData_df['published_date'] = pd.to_datetime(trafficData_df['published_date']).dt.tz_localize(None)
trafficData_df = trafficData_df[['id','published_date','issue_reported','location',
                                'latitude','longitude','address']]

trafficData_df = trafficData_df.loc[~trafficData_df['latitude'].isna() | ~trafficData_df['longitude'].isna()]

# print(trafficData_df.head())


engine_url = "postgresql://postgres:postgres@localhost:5432/trafficdb"
engine = create_engine(engine_url)
conn = engine.connect() 
metadata = MetaData(engine)

exist=sqlalchemy.inspect(engine).has_table("traffic_data")
if exist == False:
    print("Table doesn't exist")
    # traffic = Table('traffic_data', metadata,
    #             Column('id', Integer(), primary_key=True),
    #             Column('published_date', String(255), nullable=False),
    #             Column('location', String(255)),
    #             Column('latitude', Float),
    #             Column('longitude', Float),
    #             Column('address', String(255))
    #             )
    # metadata.create_all(engine)
    # print("Table was created")
    trafficData_df.to_sql('traffic_data', engine)
    print("Table loaded")
else:
 print("Table already exists in database")