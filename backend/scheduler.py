from apscheduler.schedulers.background import BackgroundScheduler
import pytz
from crawlers import ShoppingCrawler, RestaurantCrawler, EntertainmentCrawler, MedicalCrawler
from datetime import datetime

scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Shanghai'))

def update_shopping_data():
    print(f"Updating shopping data at {datetime.now()}")
    crawler = ShoppingCrawler()
    crawler.crawl()

def update_other_data():
    print(f"Updating restaurant data at {datetime.now()}")
    restaurant_crawler = RestaurantCrawler()
    restaurant_crawler.crawl()
    
    print(f"Updating entertainment data at {datetime.now()}")
    entertainment_crawler = EntertainmentCrawler()
    entertainment_crawler.crawl()
    
    print(f"Updating medical data at {datetime.now()}")
    medical_crawler = MedicalCrawler()
    medical_crawler.crawl()

def setup_scheduler():
    scheduler.add_job(
        update_shopping_data,
        'cron',
        hour='6,9,12',
        minute=0,
        second=0,
        id='shopping_daily_update',
        replace_existing=True
    )
    
    scheduler.add_job(
        update_other_data,
        'cron',
        hour=2,
        minute=0,
        second=0,
        id='other_daily_update',
        replace_existing=True
    )
    
    scheduler.start()
    print("Scheduler started successfully")
