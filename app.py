import pandas as pd
from flask import Flask, render_template, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from create_sqlite_db_v02 import traffic


app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/LoadData")
def LoadData():
    engine = create_engine(f'sqlite:///traffic.sqlite')
    session = Session(engine)

    results_df = pd.read_sql(session.query(traffic).filter(traffic.issue_reported == "CRASH URGENT").statement, session.bind)

    # session.close()
    results_df = results_df.loc[~results_df['latitude'].isna() | ~results_df['longitude'].isna()]
    data = []
    for i, result in results_df.iterrows():
        data.append({
            # 'id': result['id'],
            # 'published_date': result['published_date'],
            'issue_reported': result['issue_reported'],
            # 'location': result['location'],
            'latitude': result['latitude'],
            'longitude': result['longitude']
            # 'address': result['address'],
            # 'status': result['status'],
            # 'status_date': result['status_date']
        })
    
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)