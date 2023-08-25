import pandas as pd
from flask import Flask, render_template, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/geoData")
def geoData():
    
    engine_url = "postgresql://postgres:postgres@localhost:5432/trafficdb"
    engine = create_engine(engine_url)
    conn = engine.raw_connection()
    cur = conn.cursor()
    sql_command = 'select '
    sql_command += ' id '
    sql_command += ",to_char(published_date, 'YYYY-MM-DD HH24:MI:SS') as published_date "
    sql_command += ',issue_reported '
    sql_command += ',location '
    sql_command += ',latitude '
    sql_command += ',longitude '
    sql_command += ',address '
    sql_command += 'from traffic_data '
    sql_command += "where published_date >= '2017-01-01' "
    sql_command += "and published_date < '2023-01-01'"

    cur.execute(sql_command)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

@app.route("/chartData")
def chartData():
    
    engine_url = "postgresql://postgres:postgres@localhost:5432/trafficdb"
    engine = create_engine(engine_url)
    conn = engine.raw_connection()
    cur = conn.cursor()

    sql_command = 'select '
    sql_command += " date_trunc('day', published_date) as published_date "
    sql_command += ",count(id) as incidents "
    sql_command += "from traffic_data "
    sql_command += "where published_date >= '2017-01-01' "
    sql_command += "and published_date < '2023-01-01' "
    sql_command += "group by "
    sql_command += "date_trunc('day', published_date) "

    cur.execute(sql_command)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(ch_data)

if __name__ == "__main__":
    app.run(debug=True)