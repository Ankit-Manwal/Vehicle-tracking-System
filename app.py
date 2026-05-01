from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

def load_data():
    with open("vehicles.json") as f:
        return json.load(f)

@app.route("/vehicle/<plate>")
def get_vehicle(plate):
    data = load_data()
    plate = plate.upper().strip()
    return jsonify(data.get(plate, {}))

if __name__ == "__main__":
    app.run(debug=True)