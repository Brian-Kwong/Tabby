from flask import Flask, jsonify, request, after_this_request
from organizer import receive_groupings
import numpy as np

app = Flask(__name__)
@app.route('/', methods=['GET'])
def clu():
    @after_this_request
    def add_header(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    query = request.args.get('query')
    return jsonify({
        'embedding' : receive_groupings(query).tolist(),
        'summary' : None
    })

if __name__ == '__main__':
    app.run(debug=True)