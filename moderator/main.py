from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class HealthCheck(Resource):
    def get(self):
        return {'status': 'OK'}

api.add_resource(HealthCheck, '/')

if __name__ == '__main__':
    app.run(debug=True)