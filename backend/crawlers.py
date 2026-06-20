import requests
from bs4 import BeautifulSoup
import json
import random
from extensions import db
from models import ShoppingItem, Restaurant, Entertainment, Medical, MarketPrice
from datetime import datetime
import re

class BaseCrawler:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    def fetch(self, url):
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Fetch error: {e}")
            return None

class ShoppingCrawler(BaseCrawler):
    MARKETS = ['农贸市场A', '农贸市场B', '超市C', '便利店D', '生鲜市场E']
    
    def generate_mock_prices(self):
        categories = {
            'vegetable': ['白菜', '萝卜', '西红柿', '黄瓜', '土豆', '茄子', '青椒', '冬瓜', '南瓜', '菠菜'],
            'egg': ['土鸡蛋', '洋鸡蛋', '鸭蛋', '鹌鹑蛋'],
            'meat': ['猪肉', '牛肉', '羊肉', '鸡肉', '鱼肉'],
            'milk': ['纯牛奶', '酸奶', '豆浆', '豆奶']
        }
        
        units = {
            'vegetable': 'kg',
            'egg': '斤',
            'meat': 'kg',
            'milk': '瓶'
        }
        
        result = []
        for category, items in categories.items():
            for item_name in items:
                markets_data = []
                for _ in range(random.randint(1, 5)):
                    market = random.choice(self.MARKETS)
                    price = round(random.uniform(2, 30), 1)
                    markets_data.append({
                        'market': market,
                        'price': price,
                        'update_time': datetime.now().strftime('%Y-%m-%d %H:%M')
                    })
                
                result.append({
                    'name': item_name,
                    'category': category,
                    'unit': units[category],
                    'markets': markets_data
                })
        return result
    
    def crawl(self):
        data = self.generate_mock_prices()
        
        with db.session.begin_nested():
            for item_data in data:
                existing = ShoppingItem.query.filter_by(name=item_data['name'], category=item_data['category']).first()
                if existing:
                    MarketPrice.query.filter_by(item_id=existing.id).delete()
                    existing.unit = item_data['unit']
                    existing.updated_at = datetime.now()
                    item = existing
                else:
                    item = ShoppingItem(
                        name=item_data['name'],
                        category=item_data['category'],
                        unit=item_data['unit']
                    )
                    db.session.add(item)
                    db.session.flush()
                
                for market_data in item_data['markets']:
                    market_price = MarketPrice(
                        item_id=item.id,
                        market=market_data['market'],
                        price=market_data['price'],
                        update_time=market_data['update_time']
                    )
                    db.session.add(market_price)
        
        db.session.commit()
        print(f"Shopping data updated: {len(data)} items")

class RestaurantCrawler(BaseCrawler):
    RESTAURANTS = [
        {'name': '川湘菜馆', 'rating': 4.5, 'avg_price': 68, 'recommended': '麻婆豆腐||水煮鱼'},
        {'name': '粤港茶餐厅', 'rating': 4.3, 'avg_price': 55, 'recommended': '叉烧饭||奶茶'},
        {'name': '东北饺子馆', 'rating': 4.6, 'avg_price': 45, 'recommended': '猪肉白菜饺||酸菜白肉'},
        {'name': '兰州拉面', 'rating': 4.2, 'avg_price': 28, 'recommended': '牛肉面||大盘鸡'},
        {'name': '沙县小吃', 'rating': 4.1, 'avg_price': 20, 'recommended': '飘香拌面||蒸饺'},
        {'name': '重庆小面', 'rating': 4.4, 'avg_price': 25, 'recommended': '麻辣小面||豌杂面'},
        {'name': '云南过桥米线', 'rating': 4.3, 'avg_price': 32, 'recommended': '过桥米线||汽锅鸡'},
        {'name': '北京烤鸭店', 'rating': 4.7, 'avg_price': 128, 'recommended': '烤鸭||鸭架汤'},
        {'name': '新疆大盘鸡', 'rating': 4.5, 'avg_price': 78, 'recommended': '大盘鸡||烤包子'},
        {'name': '海鲜大排档', 'rating': 4.4, 'avg_price': 88, 'recommended': '蒜蓉扇贝||清蒸虾'}
    ]
    
    ADDRESSES = [
        '朝阳区建国路88号', '海淀区中关村大街1号', '西城区西单北大街120号',
        '东城区王府井大街255号', '丰台区方庄路10号', '石景山区古城路5号'
    ]
    
    def generate_pinyin(self, name):
        pinyin_map = {
            '川': 'chuan', '湘': 'xiang', '菜': 'cai', '馆': 'guan',
            '粤': 'yue', '港': 'gang', '茶': 'cha', '餐': 'can', '厅': 'ting',
            '东': 'dong', '北': 'bei', '饺': 'jiao', '子': 'zi',
            '兰': 'lan', '州': 'zhou', '拉': 'la', '面': 'mian',
            '沙': 'sha', '县': 'xian', '小': 'xiao', '吃': 'chi',
            '重': 'chong', '庆': 'qing',
            '云': 'yun', '南': 'nan', '过': 'guo', '桥': 'qiao', '米': 'mi',
            '北': 'bei', '京': 'jing', '烤': 'kao', '鸭': 'ya',
            '新': 'xin', '疆': 'jiang', '大': 'da', '盘': 'pan', '鸡': 'ji',
            '海': 'hai', '鲜': 'xian', '排': 'pai', '档': 'dang'
        }
        result = ''
        for char in name:
            result += pinyin_map.get(char, char)
        return result
    
    def crawl(self):
        result = []
        for rest in self.RESTAURANTS:
            result.append({
                'name': rest['name'],
                'name_pinyin': self.generate_pinyin(rest['name']),
                'address': random.choice(self.ADDRESSES),
                'rating': rest['rating'],
                'recommended_dishes': rest['recommended'],
                'avg_price': rest['avg_price'],
                'distance': round(random.uniform(0.5, 5.0), 1),
                'phone': f'1{random.randint(3, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}'
            })
        
        with db.session.begin_nested():
            for data in result:
                existing = Restaurant.query.filter_by(name=data['name']).first()
                if existing:
                    existing.name_pinyin = data['name_pinyin']
                    existing.address = data['address']
                    existing.rating = data['rating']
                    existing.recommended_dishes = data['recommended_dishes']
                    existing.avg_price = data['avg_price']
                    existing.distance = data['distance']
                    existing.phone = data['phone']
                    existing.updated_at = datetime.now()
                else:
                    restaurant = Restaurant(**data)
                    db.session.add(restaurant)
        
        db.session.commit()
        print(f"Restaurant data updated: {len(result)} items")

class EntertainmentCrawler(BaseCrawler):
    PLACES = [
        {'name': '欢乐KTV', 'type': 'entertainment', 'price': 88},
        {'name': '星光影院', 'type': 'entertainment', 'price': 45},
        {'name': '动感健身房', 'type': 'entertainment', 'price': 299},
        {'name': '悠游网咖', 'type': 'entertainment', 'price': 25},
        {'name': '童趣乐园', 'type': 'entertainment', 'price': 68},
        {'name': '蓝海游泳馆', 'type': 'entertainment', 'price': 35},
        {'name': '麦霸KTV', 'type': 'party', 'price': 128},
        {'name': '派对空间', 'type': 'party', 'price': 0},
        {'name': '花园餐厅', 'type': 'party', 'price': 158},
        {'name': '音乐酒吧', 'type': 'party', 'price': 58}
    ]
    
    ADDRESSES = [
        '朝阳区三里屯路19号', '海淀区五道口购物中心', '西城区金融街购物中心',
        '东城区崇文门外大街', '丰台区万达广场', '朝阳区望京SOHO'
    ]
    
    def generate_pinyin(self, name):
        pinyin_map = {
            '欢': 'huan', '乐': 'le', 'K': 'K', 'T': 'T', 'V': 'V',
            '星': 'xing', '光': 'guang', '影': 'ying', '院': 'yuan',
            '动': 'dong', '感': 'gan', '健': 'jian', '身': 'shen', '房': 'fang',
            '悠': 'you', '游': 'you', '网': 'wang', '咖': 'ka',
            '童': 'tong', '趣': 'qu', '乐': 'le', '园': 'yuan',
            '蓝': 'lan', '海': 'hai', '游': 'you', '泳': 'yong', '馆': 'guan',
            '麦': 'mai', '霸': 'ba',
            '派': 'pai', '对': 'dui', '空': 'kong', '间': 'jian',
            '花': 'hua', '园': 'yuan', '餐': 'can', '厅': 'ting',
            '音': 'yin', '乐': 'le', '酒': 'jiu', '吧': 'ba'
        }
        result = ''
        for char in name:
            result += pinyin_map.get(char, char)
        return result
    
    def generate_reviews(self):
        reviews = []
        user_names = ['小明', '小红', '大壮', '小美', '阿强']
        contents = [
            '环境不错，服务很好',
            '价格实惠，值得推荐',
            '体验很棒，下次还来',
            '设施齐全，干净整洁',
            '性价比高，强烈推荐'
        ]
        for _ in range(random.randint(0, 3)):
            reviews.append({
                'id': str(random.randint(1000, 9999)),
                'userName': random.choice(user_names),
                'content': random.choice(contents),
                'rating': random.randint(3, 5),
                'createTime': datetime.now().strftime('%Y-%m-%d')
            })
        return json.dumps(reviews)
    
    def crawl(self):
        result = []
        for place in self.PLACES:
            result.append({
                'name': place['name'],
                'name_pinyin': self.generate_pinyin(place['name']),
                'address': random.choice(self.ADDRESSES),
                'type': place['type'],
                'price': place['price'],
                'distance': round(random.uniform(0.5, 5.0), 1),
                'reviews': self.generate_reviews()
            })
        
        with db.session.begin_nested():
            for data in result:
                existing = Entertainment.query.filter_by(name=data['name']).first()
                if existing:
                    existing.name_pinyin = data['name_pinyin']
                    existing.address = data['address']
                    existing.type = data['type']
                    existing.price = data['price']
                    existing.distance = data['distance']
                    existing.reviews = data['reviews']
                    existing.updated_at = datetime.now()
                else:
                    entertainment = Entertainment(**data)
                    db.session.add(entertainment)
        
        db.session.commit()
        print(f"Entertainment data updated: {len(result)} items")

class MedicalCrawler(BaseCrawler):
    HOSPITALS = [
        {'name': '北京市第一人民医院', 'level': 'city'},
        {'name': '朝阳医院', 'level': 'city'},
        {'name': '海淀医院', 'level': 'city'},
        {'name': '西城中医院', 'level': 'district'},
        {'name': '东城妇幼保健院', 'level': 'district'},
        {'name': '丰台中西医结合医院', 'level': 'district'},
        {'name': '望京社区卫生服务中心', 'level': 'community'},
        {'name': '中关村社区医院', 'level': 'community'},
        {'name': '三里屯社区卫生站', 'level': 'community'},
        {'name': '方庄社区医疗中心', 'level': 'community'}
    ]
    
    ADDRESSES = [
        '东城区东单北大街3号', '朝阳区工人体育场北路', '海淀区中关村南大街2号',
        '西城区西直门外大街1号', '东城区交道口东大街8号', '丰台区丰台路25号',
        '朝阳区望京街9号', '海淀区海淀大街38号', '朝阳区三里屯路1号', '丰台区方庄芳群园'
    ]
    
    def generate_pinyin(self, name):
        pinyin_map = {
            '北': 'bei', '京': 'jing', '市': 'shi', '第': 'di', '一': 'yi', '人': 'ren', '民': 'min', '医': 'yi', '院': 'yuan',
            '朝': 'chao', '阳': 'yang',
            '海': 'hai', '淀': 'dian',
            '西': 'xi', '城': 'cheng', '中': 'zhong', '医': 'yi',
            '东': 'dong', '妇': 'fu', '幼': 'you', '保': 'bao', '健': 'jian',
            '丰': 'feng', '台': 'tai', '西': 'xi', '结': 'jie', '合': 'he',
            '望': 'wang', '京': 'jing', '社': 'she', '区': 'qu', '卫': 'wei', '生': 'sheng', '服': 'fu', '务': 'wu', '中': 'zhong', '心': 'xin',
            '中': 'zhong', '关': 'guan', '村': 'cun',
            '三': 'san', '里': 'li', '屯': 'tun', '站': 'zhan',
            '方': 'fang', '庄': 'zhuang', '疗': 'liao'
        }
        result = ''
        for char in name:
            result += pinyin_map.get(char, char)
        return result
    
    def crawl(self):
        result = []
        for i, hospital in enumerate(self.HOSPITALS):
            result.append({
                'name': hospital['name'],
                'name_pinyin': self.generate_pinyin(hospital['name']),
                'address': self.ADDRESSES[i],
                'level': hospital['level'],
                'distance': round(random.uniform(0.5, 5.0), 1),
                'phone': f'010-{random.randint(8, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}'
            })
        
        with db.session.begin_nested():
            for data in result:
                existing = Medical.query.filter_by(name=data['name']).first()
                if existing:
                    existing.name_pinyin = data['name_pinyin']
                    existing.address = data['address']
                    existing.level = data['level']
                    existing.distance = data['distance']
                    existing.phone = data['phone']
                    existing.updated_at = datetime.now()
                else:
                    medical = Medical(**data)
                    db.session.add(medical)
        
        db.session.commit()
        print(f"Medical data updated: {len(result)} items")
