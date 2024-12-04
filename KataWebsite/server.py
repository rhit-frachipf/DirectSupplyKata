import flask
import json
import os
import pickledb

app = flask.Flask(__name__,
            static_url_path='', 
            static_folder='public')

@app.route("/")
def home():
    return flask.send_from_directory(app.static_folder, "main.html")

@app.get("/shutdown")
def shutdown():
    print("Shutting down the server")
    os._exit(0)

app.run(host='0.0.0.0', port=10470)