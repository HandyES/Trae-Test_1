from flask import Flask
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import pytz
import os
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////workspace/backend/data/example_db.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

from extensions import db
db.init_app(app)

with app.app_context():
    from models import ShoppingItem, Restaurant, Entertainment, Medical, MarketPrice
    db.create_all()
    from crawlers import ShoppingCrawler, RestaurantCrawler, EntertainmentCrawler, MedicalCrawler
    ShoppingCrawler().crawl()
    RestaurantCrawler().crawl()
    EntertainmentCrawler().crawl()
    MedicalCrawler().crawl()

from routes import register_routes
from scheduler import setup_scheduler

register_routes(app)
setup_scheduler()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
