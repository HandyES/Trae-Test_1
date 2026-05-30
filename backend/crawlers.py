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
    MARKETS = ['北环批发市场', '东环批发市场', '宁鲜市场', '本地超市', '社区生鲜']
    
    def generate_mock_prices(self):
        categories = {
            'vegetable': ['大白菜', '萝卜', '西红柿', '黄瓜', '土豆', '茄子', '青椒', '冬瓜', '南瓜', '菠菜'],
            'egg': ['土鸡蛋', '普通鸡蛋', '鸭蛋', '鹌鹑蛋'],
            'meat': ['猪肉', '牛肉', '羊肉', '鸡肉', '鱼肉'],
            'milk': ['纯牛奶', '酸奶', '豆浆', '豆奶']
        }
        
        units = {
            'vegetable': '斤',
            'egg': '斤',
            'meat': '斤',
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
        {'name': '张记面馆', 'rating': 4.5, 'avg_price': 18, 'recommended': '牛肉面||炒面||凉拌菜'},
        {'name': '王记饺子馆', 'rating': 4.4, 'avg_price': 16, 'recommended': '猪肉白菜饺||韭菜鸡蛋饺||小米粥'},
        {'name': '李记麻辣烫', 'rating': 4.3, 'avg_price': 18, 'recommended': '麻辣烫||酸辣粉||炸串'},
        {'name': '马家包子铺', 'rating': 4.6, 'avg_price': 12, 'recommended': '牛肉包子||羊肉包子||豆浆'},
        {'name': '陈记凉皮店', 'rating': 4.5, 'avg_price': 12, 'recommended': '凉皮||擀面皮||牛筋面'},
        {'name': '刘记砂锅', 'rating': 4.4, 'avg_price': 22, 'recommended': '砂锅烩菜||砂锅排骨||米饭'},
        {'name': '赵记烧烤', 'rating': 4.3, 'avg_price': 35, 'recommended': '烤羊肉串||烤鸡翅||烤茄子'},
        {'name': '孙记羊杂碎', 'rating': 4.5, 'avg_price': 20, 'recommended': '羊杂碎||饼子||糖蒜'},
        {'name': '周记拌面', 'rating': 4.2, 'avg_price': 18, 'recommended': '牛肉拌面||鸡肉拌面||汤面'},
        {'name': '吴记家常菜', 'rating': 4.3, 'avg_price': 25, 'recommended': '酸辣土豆丝||番茄炒蛋||麻婆豆腐'}
    ]
    
    ADDRESSES = [
        '银川市兴庆区利民街', '银川市兴庆区新华街', '银川市金凤区福州街',
        '银川市兴庆区解放街', '银川市西夏区怀远路', '银川市金凤区正源街'
    ]
    
    def generate_pinyin(self, name):
        pinyin_map = {
            '张': 'zhang', '记': 'ji', '面': 'mian', '馆': 'guan',
            '王': 'wang', '饺': 'jiao', '子': 'zi',
            '李': 'li', '麻': 'ma', '辣': 'la', '烫': 'tang',
            '马': 'ma', '包': 'bao', '铺': 'pu',
            '陈': 'chen', '凉': 'liang', '皮': 'pi',
            '刘': 'liu', '砂': 'sha', '锅': 'guo',
            '赵': 'zhao', '烧': 'shao', '烤': 'kao',
            '孙': 'sun', '羊': 'yang', '杂': 'za', '碎': 'sui',
            '周': 'zhou', '拌': 'ban',
            '吴': 'wu', '常': 'chang', '家': 'jia', '菜': 'cai'
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
                'phone': f'0951-{random.randint(1000000, 9999999)}'
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
        {'name': '中山公园', 'type': 'entertainment', 'price': 0},
        {'name': '海宝公园', 'type': 'entertainment', 'price': 0},
        {'name': '览山公园', 'type': 'entertainment', 'price': 0},
        {'name': '阅海公园', 'type': 'entertainment', 'price': 0},
        {'name': '宝湖公园', 'type': 'entertainment', 'price': 0},
        {'name': '花博园', 'type': 'entertainment', 'price': 0},
        {'name': '鸿运棋牌室', 'type': 'entertainment', 'price': 25},
        {'name': '福星棋牌室', 'type': 'entertainment', 'price': 30},
        {'name': '聚友棋牌室', 'type': 'entertainment', 'price': 28},
        {'name': '康乐棋牌室', 'type': 'entertainment', 'price': 22},
        {'name': '麦乐星KTV', 'type': 'party', 'price': 58},
        {'name': '银川剧院', 'type': 'party', 'price': 120},
        {'name': '星聚会KTV', 'type': 'party', 'price': 68},
        {'name': '银川文化城', 'type': 'party', 'price': 0},
        {'name': '金色阳光温泉', 'type': 'party', 'price': 168}
    ]
    
    ADDRESSES = [
        '银川市兴庆区湖滨街', '银川市兴庆区上海东路', '银川市金凤区沈阳路',
        '银川市金凤区大连路', '银川市金凤区金波街', '银川市金凤区亲水街',
        '银川市兴庆区新华街', '银川市兴庆区解放街', '银川市西夏区怀远路'
    ]
    
    def generate_pinyin(self, name):
        pinyin_map = {
            '中': 'zhong', '山': 'shan', '公': 'gong', '园': 'yuan',
            '海': 'hai', '宝': 'bao', '览': 'lan', '阅': 'yue',
            '花': 'hua', '博': 'bo', '鸿': 'hong', '运': 'yun',
            '棋': 'qi', '牌': 'pai', '室': 'shi', '福': 'fu',
            '星': 'xing', '聚': 'ju', '友': 'you', '康': 'kang',
            '乐': 'le', '麦': 'mai', '文': 'wen', '化': 'hua',
            '城': 'cheng', '金': 'jin', '色': 'se', '阳': 'yang',
            '光': 'guang', '温': 'wen', '泉': 'quan', '剧': 'ju',
            '院': 'yuan', 'K': 'K', 'T': 'T', 'V': 'V'
        }
        result = ''
        for char in name:
            result += pinyin_map.get(char, char)
        return result
    
    def generate_reviews(self):
        reviews = []
        user_names = ['张大爷', '李阿姨', '王叔叔', '赵奶奶', '钱爷爷']
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
        {'name': '银川市第一人民医院', 'level': 'city'},
        {'name': '宁夏医科大学总医院', 'level': 'city'},
        {'name': '银川市人民医院', 'level': 'city'},
        {'name': '宁夏人民医院', 'level': 'city'},
        {'name': '银川市中医医院', 'level': 'city'},
        {'name': '银川市口腔医院', 'level': 'city'},
        {'name': '兴庆区社区卫生服务中心', 'level': 'community'},
        {'name': '金凤区社区卫生服务中心', 'level': 'community'},
        {'name': '西夏区社区卫生服务中心', 'level': 'community'},
        {'name': '玉皇阁北街社区卫生服务站', 'level': 'community'},
        {'name': '解放西街社区卫生服务站', 'level': 'community'},
        {'name': '长城中路社区卫生服务站', 'level': 'community'}
    ]
    
    ADDRESSES = [
        '银川市兴庆区利群西街', '银川市兴庆区胜利街', '银川市金凤区黄河路',
        '银川市金凤区正源街', '银川市兴庆区解放街', '银川市金凤区北京路',
        '银川市兴庆区文化街', '银川市金凤区福州街', '银川市西夏区文昌街',
        '银川市兴庆区玉皇阁北街', '银川市兴庆区解放西街', '银川市金凤区长城中路'
    ]
    
    def generate_pinyin(self, name):
        pinyin_map = {
            '银': 'yin', '川': 'chuan', '市': 'shi', '第': 'di', '一': 'yi',
            '人': 'ren', '民': 'min', '医': 'yi', '院': 'yuan', '宁': 'ning',
            '夏': 'xia', '科': 'ke', '大': 'da', '学': 'xue', '总': 'zong',
            '中': 'zhong', '医': 'yi', '口': 'kou', '腔': 'qiang',
            '社': 'she', '区': 'qu', '卫': 'wei', '生': 'sheng', '服': 'fu',
            '务': 'wu', '中': 'zhong', '心': 'xin', '玉': 'yu', '皇': 'huang',
            '阁': 'ge', '北': 'bei', '街': 'jie', '长': 'chang', '解': 'jie',
            '放': 'fang', '西': 'xi', '城': 'cheng'
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
                'phone': f'0951-{random.randint(1000000, 9999999)}'
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
