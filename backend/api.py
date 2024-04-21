from flask import Flask, jsonify, request
from organizer import receive_groupings
import numpy as np

app = Flask(__name__)
@app.route('/', methods=['GET'])
def clu():
    query = request.args.get('query')
    return {
        'embedding' : receive_groupings(query).tolist(),
        'summary' : None
    }

if __name__ == '__main__':
    app.run(debug=True)