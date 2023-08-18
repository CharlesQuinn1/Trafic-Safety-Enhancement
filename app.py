import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt
import pandas as pd

from flask import Flask, jsonify, render_template

#################################################
# Database Setup
#################################################
engine = create_engine(r"sqlite:///Data/traffic.db")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
trafficdata = Base.classes.trafficdata

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    """
    Render the main page of the webapp.

    """
    return render_template('index.html')

@app.route("/api/v1.0/trafficdata")
def trafficdata():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    results = session.query(trafficdata.traffic_report_id, trafficdata.published_date, trafficdata.issue_reported, trafficdata.location,
                            trafficdata.latitude, trafficdata.longitude, trafficdata.address, trafficdata.status, trafficdata.status_date).all()

    data = []
    for traffic_report_id,published_date,issue_reported,location,latitude,longitude,address,status,status_date in results:
        all_data = {}
        all_data["traffic_report_id"] = traffic_report_id
        all_data["published_date"] = published_date
        all_data["issue_reported"] = issue_reported
        all_data["location"] = location
        all_data["latitude"] = latitude
        all_data["longitude"] = longitude
        all_data["address"] = address
        all_data["status"] = status
        all_data["status_date"] = status_date
        data.append(all_data)
        
    return data

if __name__ == "__main__":
    app.run(debug=False)