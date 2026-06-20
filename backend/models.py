from datetime import datetime
from extensions import db

class MarketPrice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('shopping_item.id'), nullable=False)
    market = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    update_time = db.Column(db.String(50))
    
    def to_dict(self):
        return {
            'market': self.market,
            'price': self.price,
            'update_time': self.update_time
        }

class ShoppingItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    markets = db.relationship('MarketPrice', backref='shopping_item', cascade='all, delete-orphan')
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'unit': self.unit,
            'markets': [market.to_dict() for market in self.markets]
        }

class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    name_pinyin = db.Column(db.String(200))
    address = db.Column(db.String(500))
    rating = db.Column(db.Float)
    recommended_dishes = db.Column(db.Text)
    avg_price = db.Column(db.Float)
    distance = db.Column(db.Float)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'namePinyin': self.name_pinyin,
            'address': self.address,
            'rating': self.rating,
            'recommendedDishes': self.recommended_dishes.split('||') if self.recommended_dishes else [],
            'avgPrice': self.avg_price,
            'distance': self.distance,
            'phone': self.phone
        }

class Entertainment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    name_pinyin = db.Column(db.String(200))
    address = db.Column(db.String(500))
    type = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float)
    distance = db.Column(db.Float)
    reviews = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        import json
        try:
            reviews_list = json.loads(self.reviews) if self.reviews else []
        except:
            reviews_list = []
        return {
            'id': self.id,
            'name': self.name,
            'namePinyin': self.name_pinyin,
            'address': self.address,
            'type': self.type,
            'price': self.price,
            'distance': self.distance,
            'reviews': reviews_list
        }

class Medical(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    name_pinyin = db.Column(db.String(200))
    address = db.Column(db.String(500))
    level = db.Column(db.String(50), nullable=False)
    distance = db.Column(db.Float)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'namePinyin': self.name_pinyin,
            'address': self.address,
            'level': self.level,
            'distance': self.distance,
            'phone': self.phone
        }
