from flask import Flask, jsonify, request, after_this_request
from flask_restful import reqparse
from flask_cors import CORS
from organizer import receive_groupings, receive_embeddings
import numpy as np
import re

app = Flask(__name__)
CORS(app, origins=['*']) # fill in right extension

parser = reqparse.RequestParser()
parser.add_argument('list', type=list)


@app.route('/', methods=['POST', 'GET'])
def clu():
    data = request.json

    query = [re.sub(r"""[,.;@#?!&$:/+=-]+\ *"""," ",req, flags=re.VERBOSE) for req in data]
    query = [req.replace("_", " ") for req in data]
    embeddings = receive_embeddings(query)
    result = receive_groupings(embeddings, vagueness=1.40)
    result = result.tolist()
    result = jsonify({
        'groupings' : result,
        'summary' : None
    })
    result.headers.add("Access-Control-Allow-Origin", "*")
    return result

if __name__ == '__main__':
    app.run(debug=True)