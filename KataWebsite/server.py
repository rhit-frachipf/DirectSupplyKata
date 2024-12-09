import flask
import json
import os
import pickledb

#declare flask app
app = flask.Flask(__name__,
                  static_url_path='',
                  static_folder='public')

#load db
db = pickledb.load('scores.db', False)

#set the default page
@app.route("/")
def home():
    return flask.send_from_directory(app.static_folder, "main.html")

#add the quiz scores to db
@app.route("/quiz", methods=["POST"])
def quiz():
    data = flask.request.json
    db.set(data['user'], data['score'])
    db.dump()
    return {"message": "saved score"}

#fetch score by user
@app.route("/results/<user>")
def results(user):
    score = db.get(user)

    if score:
        return {"user": user, "score": score}
    else:
        return {"error": "user not in db"}

#gets data for leaderboard
@app.route("/leaderboard")
def leaderboard():
    scores = []

    for user in db.getall():
        score = db.get(user)
        scores.append((user, score))
    
    #sort data by highest scores
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    #take only the 10 highewt scores
    leaderboard = sorted_scores[:10]

    return json.dumps(leaderboard)

#shutown server
@app.get("/shutdown")
def shutdown():
    print("shutting down server")
    os._exit(0)

#start server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=10470)
