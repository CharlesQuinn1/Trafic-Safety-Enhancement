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
    # txt = "select id as id, published_date::timestamp as published_date, issue_reported as issue_reported, ST_X(ST_Centroid(ST_Transform(geometry, 4326))) AS longitude, ST_Y(ST_Centroid(ST_Transform(geometry, 4326))) AS latitude from trafficgeo"
    sql_command = 'select row_to_json(fc)'
    sql_command += 'from ('
    sql_command += '    select'
    sql_command += "        'FeatureCollection'"
    sql_command += '		as "type",'
    sql_command += '        array_to_json(array_agg(f))'
    sql_command += '		as "features"'
    sql_command += '    from ('
    sql_command += '        select'
    sql_command += "            'Feature'"
    sql_command += '			as "type",'
    sql_command += '            ST_AsGeoJSON(ST_Transform(geometry, 4326), 6) :: json'
    sql_command += '			as "geometry",'
    sql_command += '            ('
    sql_command += '                select json_strip_nulls(row_to_json(t))'
    sql_command += '                from ('
    sql_command += '                    select'
    sql_command += '                        id,'
    sql_command += '                        published_date::timestamp,'
    sql_command += '                        issue_reported'
    sql_command += '                ) t'
    sql_command += '            )'
    sql_command += '			as "properties"'
    sql_command += '        from trafficgeo'
    sql_command += '        where'
    sql_command += "            published_date::timestamp > '2023-06-01'"
    sql_command += '    ) as f'
    sql_command += ') as fc;'
    cur.execute(sql_command)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return data
    # return render_template('index.html',data=data)




if __name__ == "__main__":
    app.run(debug=True)