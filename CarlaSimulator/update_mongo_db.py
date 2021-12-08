from __future__ import print_function

import time

from pymongo import MongoClient
import json
from pathlib import Path


# ++++++++++++++++++++++++++++++++++++++Mongo DB+++++++++++++++++++#
while True:
    # code goes here
    client = MongoClient(
        "mongodb+srv://admin:Swetha12345@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority")
    db = client.get_database('AVCLOUD')
    # print(client.list_database_names())

    client = MongoClient(
            "mongodb+srv://admin:Swetha12345@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority")
    db = client.get_database('AVCLOUD')
        # print(client.list_database_names())
    records = db.LiveSensorData

        # Created or Switched to collection names: my_gfg_collection
    sensorData = Path("/opt/carla-simulator/PythonAPI/examples/sensorData/data.json")
    if sensorData.is_file():
        sensorInfo = []

        print("Started Reading JSON file which contains multiple JSON document")
        with open("/opt/carla-simulator/PythonAPI/examples/sensorData/data.json", 'r') as f:
            for frame in f:
                sensorDict = json.loads(frame)
                sensorInfo.append(sensorDict)


        # with open("/opt/carla-simulator/PythonAPI/examples/sensorData/data.json") as file:
        #     file_data = json.load(file)
        # for frame in open("/opt/carla-simulator/PythonAPI/examples/sensorData/data.json",'r'):
        #     sensorInfo.append(json.loads(frame))

        if isinstance(sensorInfo, list):
            # records.delete_many({})
            records.insert_many(sensorInfo)
        else:
            records.insert_one(sensorInfo)

        print("uploaded live data ")

    time.sleep(5)

