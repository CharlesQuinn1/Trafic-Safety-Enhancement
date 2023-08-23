import pandas as pd
from flask import Flask, render_template, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from create_sqlite_db_v02 import traffic
import psycopg2

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/geoData")
def geoData():
    import psycopg2
    conn = psycopg2.connect(host='localhost',
                            database='traffic',
                            user='postgres',
                            password='postgres')

    cur = conn.cursor()
    txt = "select id as id, published_date::timestamp as published_date, issue_reported as issue_reported, ST_X(ST_Centroid(ST_Transform(geometry, 4326))) AS longitude, ST_Y(ST_Centroid(ST_Transform(geometry, 4326))) AS latitude from trafficgeo"
    cur.execute(txt)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)
    # return render_template('index_.html', data = data)

if __name__ == "__main__":
    app.run(debug=True)