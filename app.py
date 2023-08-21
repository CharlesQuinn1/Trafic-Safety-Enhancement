from flask import Flask, render_template, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#load from database file
from data.create_sqlite_db_v02 import traffic, database_path
import pandas as pd

app = Flask(__name__) 

@app.route("/")
def index():
    return render_template('index_test.html')

@app.route("/api/v1.0/trafficdata")

def trafficdata():
    from sqlalchemy.orm import Session

    # load sqlite database
    engine = create_engine(f'sqlite:///{database_path}', echo=False)
    session = Session(engine)

    results = pd.read_sql(session.query(traffic).all())

    data = []
    for i, row in results.iterrows():
        data.append({
            'id': row['id'],
            'published_date': row['published_date'],
            'issue_reported': row['issue_reported'],
            'location': row['location'],
            'latitude': row['latitude'],
            'longitude': row['longitude'],
            'address': row['address'],
            'status': row['status'],
            'status_date': row['status_date']})

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=False)