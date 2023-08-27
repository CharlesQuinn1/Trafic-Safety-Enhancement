import pandas as pd
from flask import Flask, render_template, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, extract
from sqlalchemy.ext.automap import automap_base

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

app = Flask(__name__)

@app.route("/")
def index():
    
    return render_template('index.html')

@app.route("/geoData")
def geoData():

    # session = Session(engine)
    # Query to group by year and time
    results = (
    session.query(
        TrafficReport.latitude,
        TrafficReport.longitude
    ).all()
    )
 # Convert results to a list of dictionaries
    result_dicts = [
    {"latitude": result.latitude, "longitude": result.longitude}
    for result in results
    ]

    session.close()

    return jsonify(result_dicts)
    
@app.route('/api/v1.0/date')
def date_func2():    
    # session = Session(engine)
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

@app.route("/analysis")
def analysis():

    # session = Session(engine)
    # Query to group by year and time
    sql = '    select '
    sql +=' tbl.issue_reported '
    sql +=',tbl.issue_count '
    sql +=',tbl.cal_year '
    sql +='from '
    sql +='(select '
    sql +=" upper(replace(issue_reported, 'z', '')) as issue_reported "
    sql +=',extract(year from published_date) as cal_year '
    sql +=',count(report_id) as issue_count '
    sql +='from traffic_report '
    sql +='group by '
    sql +=" upper(replace(issue_reported, 'z', '')) "
    sql +=',extract(year from published_date) '
    sql +=') as tbl '
    sql +='where tbl.issue_count > 500 '
    results = session.execute(sql)

 # Convert results to a list of dictionaries
    result_dicts = [
    {"year": result.cal_year, "issue_reported": result.issue_reported, "issue_count": result.issue_count}
    for result in results
    ]

    session.close()

    return jsonify(result_dicts)


if __name__ == "__main__":
    app.run(debug=True)