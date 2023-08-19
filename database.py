from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, String


dbpath = "data/traffic.sqllite"

# reflect an existing database into a new model
Base = declarative_base()

class table(Base):
    __tablename__ = 'trafficdata'

    traffic_report_id = Column(String, primary_key=True)
    published_date = Column(String)
    issue_reported = Column(String)
    location = Column(String)
    latitude = Column(String)
    longitude = Column(String)
    address = Column(String)
    status = Column(String)
    status_date = Column(String)

if __name__ == "__main__":
    import pandas as pd
    from sqlalchemy.orm import Session
    import os

    if os.path.exists(dbpath):
        os.remove(dbpath)
    
    engine = create_engine(f'sqlite:///{dbpath}')
    Base.metadata.create_all(engine)

    session = Session(engine)
    trafficData_df = pd.read_csv(r'Real-Time_Traffic_Incident_Reports.csv')
    for i, row in trafficData_df.iterrows():
        session.add(table(traffic_report_id = row.traffic_report_id,
                published_date = row.published_date,
                issue_reported = row.issue_reported,
                location = row.location,
                latitude = row.latitude,
                longitude = row.longitude,
                address = row.address,
                status = row.status,
                status_date = row.status_date
        ))
    session.commit()

results = session.query(table).all()

data = pd.read_sql(session.query(table).statement, session.bind)

print(data.head())