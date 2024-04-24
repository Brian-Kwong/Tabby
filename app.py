from flask import Flask, jsonify, request, after_this_request, Response
from flask_restful import reqparse
from flask_cors import *
from organizer import receive_groupings, receive_embeddings
import numpy as np
import re
import aws_lambda_wsgi as awsgi                                       


app = Flask(__name__)

parser = reqparse.RequestParser()
parser.add_argument('list', type=list)


@app.route('/',methods=['GET', 'POST'])
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
    return result


def lambda_handler(event, context):
    event['httpMethod'] = event['requestContext']['http']['method']
    event['path'] = event['requestContext']['http']['path']
    event['queryStringParameters'] = event.get('queryStringParameters', {})
    return awsgi.response(app,event,context)