from flask import Flask, render_template, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#load from database file
from database import table, dbpath
import pandas as pd

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index_test.html')

@app.route("/api/v1.0/trafficdata")

def trafficdata():

    engine = create_engine(f'sqlite:///{dbpath}')
    session = Session(engine)

    results = pd.read_sql(session.query(table).statement, session.bind)

    data = []
    for i, traffic_report_id,published_date,issue_reported,location,latitude,longitude,address,status,status_date in results.iterrows():
        data.append({
        "traffic_report_id": traffic_report_id,
        "published_date": published_date,
        "issue_reported": issue_reported,
        "location": location,
        "latitude": latitude,
        "longitude": longitude,
        "address": address,
        "status": status,
        "status_date": status_date})

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)