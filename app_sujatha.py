import pandas as pd
from flask import Flask, render_template, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func,extract,cast
from create_sqlite_db_v02 import traffic
from datetime import datetime

# Import the dependencies.
import numpy as np
from flask import Flask, jsonify
from sqlalchemy.ext.automap import automap_base
from pathlib import Path
import datetime as dt

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///traffic.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
TrafficData = Base.classes.trafficData


# Create our session (link) from Python to the DB

# session = Session(engine)
#################################################
# Flask Setup
#################################################

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index_sujatha.html')

@app.route('/api/v1.0/date')
def date_func():    
    session = Session(engine)
    results = session.query(TrafficData.published_date).limit(100).all()

    date_buckets = {}

    for date in results:
        date_str = date[0]
        parsed_date = datetime.strptime(date_str, "%m/%d/%Y %I:%M:%S %p %z")
        year = parsed_date.strftime('%Y')
        month = parsed_date.strftime('%m')
        hour = parsed_date.strftime('%H')
        date_buckets[date_str]= {"year":year,"month":month,"hour":hour}

    # results = session.query(TrafficData.published_date).all()
    session.close()

    return jsonify(date_buckets)


if __name__ == '__main__':
    app.run(debug=True)