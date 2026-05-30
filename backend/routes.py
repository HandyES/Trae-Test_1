from flask import jsonify, request
from extensions import db
from models import ShoppingItem, Restaurant, Entertainment, Medical
from datetime import datetime, timedelta

def register_routes(app):
    @app.route('/api/shopping', methods=['GET'])
    def get_shopping():
        category = request.args.get('category', 'all')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        query = ShoppingItem.query
        if category != 'all':
            query = query.filter_by(category=category)
        
        items = query.offset(offset).limit(limit).all()
        total = query.count()
        
        return jsonify({
            'success': True,
            'data': [item.to_dict() for item in items],
            'total': total
        })

    @app.route('/api/restaurants', methods=['GET'])
    def get_restaurants():
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        restaurants = Restaurant.query.offset(offset).limit(limit).all()
        total = Restaurant.query.count()
        
        return jsonify({
            'success': True,
            'data': [r.to_dict() for r in restaurants],
            'total': total
        })

    @app.route('/api/entertainment', methods=['GET'])
    def get_entertainment():
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        entertainment = Entertainment.query.offset(offset).limit(limit).all()
        total = Entertainment.query.count()
        
        return jsonify({
            'success': True,
            'data': [e.to_dict() for e in entertainment],
            'total': total
        })

    @app.route('/api/medical', methods=['GET'])
    def get_medical():
        level = request.args.get('level', 'all')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        query = Medical.query
        if level != 'all':
            query = query.filter_by(level=level)
        
        medical = query.offset(offset).limit(limit).all()
        total = query.count()
        
        return jsonify({
            'success': True,
            'data': [m.to_dict() for m in medical],
            'total': total
        })

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'success': True,
            'message': 'Server is running',
            'timestamp': datetime.now().isoformat()
        })

    @app.route('/api/cleanup', methods=['POST'])
    def cleanup_old_data():
        seven_days_ago = datetime.now() - timedelta(days=7)
        
        ShoppingItem.query.filter(ShoppingItem.created_at < seven_days_ago).delete()
        Restaurant.query.filter(Restaurant.created_at < seven_days_ago).delete()
        Entertainment.query.filter(Entertainment.created_at < seven_days_ago).delete()
        Medical.query.filter(Medical.created_at < seven_days_ago).delete()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Old data cleaned up'
        })
