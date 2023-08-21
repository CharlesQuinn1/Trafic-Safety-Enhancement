import os
from sqlalchemy import create_engine, Column, Integer, String, Float, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

path = 'Trafic-Safety-Enhancement/data/'
dfile = 'Real-Time_Traffic_Incident_Reports.csv'
datapath = os.path.join(path, dfile)
dbfile = 'traffic.sqlite'
database_path = os.path.join(path, dbfile)

base = declarative_base()

class traffic(base):
    __tablename__ = 'trafficData'
    id = Column(Integer, primary_key=True)
    published_date = Column(String(255))
    issue_reported = Column(String(255))
    location = Column(String(255))
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String(255))
    status = Column(String(255))
    status_date = Column(String(255))

if __name__ == "__main__":
    import pandas as pd
    from sqlalchemy.orm import Session

    if os.path.exists(database_path):
        os.remove(database_path)

    engine = create_engine(f'sqlite:///{database_path}')
    base.metadata.create_all(engine)
    session = Session(engine)

    # import data from csv
    trafficData_df = pd.read_csv(datapath)
    trafficData_df['issue_reported'] = trafficData_df['issue_reported'].str.upper()
    trafficData_df['id'] = trafficData_df.index
    trafficData_df.drop(columns=['traffic_report_id'], inplace=True)
    trafficData_df = trafficData_df[['id','published_date','issue_reported','location',
                                    'latitude','longitude','address','status','status_date']] 
    # load sqlite table
    for i, row in trafficData_df.iterrows():
        session.add(traffic(id=row['id'],
                            published_date=row['published_date'],
                            issue_reported=row['issue_reported'],
                            location=row['location'],
                            latitude=row['latitude'],
                            longitude=row['longitude'],
                            address=row['address'],
                            status=row['status'],
                            status_date=row['status_date']))
    
    session.commit()