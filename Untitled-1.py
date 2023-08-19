# import sqlite3
# import pandas as pd

# # create a sqlite database and a connection to it
# cnxn = sqlite3.connect('traffic.db')
# crsr = cnxn.cursor()

# rows = crsr.execute("SELECT * FROM trafficdata")
# rows = crsr.fetchall()
# rows_df = pd.DataFrame(rows)
# i = 0
# for row in rows:
#     if i > 5:
#         break
#     else:
#         print(row)

#     i = i + 1

# crsr.close()
# cnxn.close()
import pandas as pd

trafficData_df = pd.read_csv(r'Real-Time_Traffic_Incident_Reports.csv')
print(trafficData_df.head())