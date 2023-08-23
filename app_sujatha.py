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
import psycopg2

#################################################
# Database Setup
#################################################

# engine = create_engine("sqlite:///traffic.sqlite")
engine = create_engine("postgresql://postgres:postgres@localhost:5432/traffic")
# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
TrafficReport = Base.classes.traffic_report


# Create our session (link) from Python to the DB

session = Session(engine)
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
    results = session.query(TrafficReport.published_date).limit(100).all()
    date_buckets = {}

    for date in results:
        date_str = date[0]
        # published_datetime = datetime.strptime(date.published_date, '%m/%d/%Y %I:%M:%S %p %z')
        date_str = date.published_date.strftime('%Y-%m-%d %H:%M:%S')
        date_buckets[date_str]= date.published_date
    session.close()

    return jsonify(date_buckets)

@app.route('/api/v1.0/date2')
def date_func2():    
    session = Session(engine)
    # Query to group by year and time
    results = (
    session.query(
        extract('year', TrafficReport.published_date).label('year'),
        extract('hour', TrafficReport.published_date).label('hour'),
        func.count(TrafficReport.published_date).label('count')
    )
    .group_by('year', 'hour')
    .all()
    )
 # Convert results to a list of dictionaries
    result_dicts = [
    {"year": result.year, "hour": result.hour, "count": result.count}
    for result in results
    ]

    # Convert list of dictionaries to JSON
    #json_result = json.dumps(result_dicts, indent=4)

# Print or use the JSON result

    session.close()

    return jsonify(result_dicts)

if __name__ == '__main__':
    app.run(debug=True)