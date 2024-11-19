import requests
from lxml import html
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

def fetch_wolfjobs():
    url = ""
    name = ""
    link = ""
    return name, link
        