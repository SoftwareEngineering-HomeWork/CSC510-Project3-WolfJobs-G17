import requests
from lxml import html
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

def fetch_wolfjobs():
    url = "https://campusenterprises.ncsu.edu/dept/hr/opportunities/student/jobs/"
    try:
        response = requests.get(url)
        response.raise_for_status()
        tree = html.fromstring(response.content)
        listings = tree.xpath('//a[@class="ce-jazzhr-job"]')
        total_listings = len(listings)
        dept = tree.xpath('//a[@class="ce-jazzhr-dept"]')
        
        i=0
        positions = []
        links = []
        departments = []

        while i<total_listings:
            positions.append(listings[i].text_content().strip())
            links.append(listings[i].get('href').strip())
            departments.append(dept[i].text_content().strip())
            i += 1
        
        return positions,links,departments
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        raise Exception(f"Error fetching data: {str(e)}")
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise Exception(f"Unexpected error: {str(e)}")
        
@app.route('/live-wolfjobs', methods=['GET'])
def get_lists():
    try:
        positions, links, departments = fetch_wolfjobs()
        return jsonify({
            "positions": positions,
            "links": links,
            "departments": departments
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5007,debug=True)