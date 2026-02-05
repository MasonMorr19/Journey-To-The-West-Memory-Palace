"""
西遊記記憶宮殿 Python 后端
Xī Yóu Jì Jì Yì Gōng Diàn Python Backend

Journey to the West Memory Palace - Backend Services

This module provides:
1. Character analysis and decomposition using Ricci's method
2. Memory palace station management
3. Spaced repetition algorithm for learning
4. ArcGIS integration for geographical memory anchoring
5. Multi-dialect pronunciation support

Following the principles from:
- Matteo Ricci's "Treatise on Mnemonic Arts" (1596)
- Giordano Bruno's "De Umbris Idearum" (1582)
- Journey to the West narrative structure

Author: Memory Palace Development Team
Version: 1.0.0
"""

import json
import sqlite3
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field, asdict
from enum import Enum
import math
import os

# For ArcGIS integration (conceptual - would need arcgis package installed)
# from arcgis.gis import GIS
# from arcgis.mapping import WebMap


class Dialect(Enum):
    """
    支持的方言 (Zhīchí de fāngyán) - Supported Dialects
    
    Each dialect has distinct tonal patterns and romanization systems.
    Respecting linguistic diversity while building Mandarin proficiency.
    """
    MANDARIN = "mandarin"       # 普通话 Pǔtōnghuà - Standard
    CANTONESE = "cantonese"     # 粤语 Yuèyǔ - 9 tones
    MINNAN = "minnan"           # 闽南语 Mǐnnányǔ - Hokkien/Taiwanese
    SHANGHAINESE = "shanghainese"  # 上海话 Shànghǎihuà - Wu dialect
    SICHUANESE = "sichuanese"   # 四川话 Sìchuānhuà - Southwestern


class LearningPhase(Enum):
    """
    学习阶段 (Xuéxí jiēduàn) - Learning Phases
    
    Following Ricci's methodology:
    1. Overview - First impression
    2. Decompose - Break into components
    3. Imagine - Create vivid imagery
    4. Practice - Active recall
    5. Master - Spaced repetition
    """
    NEW = "new"
    OVERVIEW = "overview"
    DECOMPOSE = "decompose"
    IMAGINE = "imagine"
    PRACTICE = "practice"
    MASTER = "master"


@dataclass
class PronunciationInfo:
    """
    发音信息 (Fāyīn xìnxī) - Pronunciation Information
    
    Stores pronunciation data for each dialect variant.
    """
    pinyin: str = ""           # Romanization
    ipa: str = ""              # International Phonetic Alphabet
    tone: int = 0              # Tone number (dialect-specific)
    audio_file: str = ""       # Path to audio pronunciation
    
    def to_dict(self) -> Dict:
        return asdict(self)


@dataclass
class MemoryImage:
    """
    记忆图像 (Jìyì túxiàng) - Memory Image
    
    Following Bruno's principles:
    "Images should be emotionally striking, either heroic, horrifying or comic"
    
    Each memory image connects to Journey to the West narrative.
    """
    scene: str = ""            # The visual scene description
    action: str = ""           # Dynamic action (not static)
    emotion: str = ""          # Emotional anchor
    mnemonic_phrase: str = ""  # Key pronunciation/meaning hook
    pilgrim_guide: str = ""    # Which pilgrim guides this character
    location_in_palace: str = ""  # Spatial placement
    
    def to_dict(self) -> Dict:
        return asdict(self)


@dataclass
class Character:
    """
    汉字 (Hànzì) - Chinese Character
    
    Core data structure for each character in the memory palace.
    Implements Ricci's ideograph-as-image principle.
    """
    character: str                          # The character itself
    pinyin: str                             # Mandarin pinyin
    ipa: str                                # IPA pronunciation
    tone: int                               # Tone (1-4 for Mandarin)
    meaning: str                            # English meaning
    radical_number: int                     # Kangxi radical number
    stroke_count: int                       # Number of strokes
    memory_image: MemoryImage = field(default_factory=MemoryImage)
    dialects: Dict[str, PronunciationInfo] = field(default_factory=dict)
    stroke_analysis: Dict[str, str] = field(default_factory=dict)
    usage_examples: List[Dict] = field(default_factory=list)
    compound_characters: List[str] = field(default_factory=list)
    cultural_note: str = ""
    philosophical_note: Dict = field(default_factory=dict)
    
    def get_unique_id(self) -> str:
        """Generate unique ID for this character"""
        return hashlib.md5(
            f"{self.character}_{self.radical_number}".encode()
        ).hexdigest()[:8]
    
    def to_dict(self) -> Dict:
        result = asdict(self)
        result['memory_image'] = self.memory_image.to_dict()
        result['dialects'] = {
            k: v.to_dict() for k, v in self.dialects.items()
        }
        return result


@dataclass
class MemoryStation:
    """
    记忆站点 (Jìyì zhàndiǎn) - Memory Station
    
    A locus within the memory palace, containing multiple characters.
    Based on Journey to the West locations.
    """
    id: str
    name_chinese: str
    name_pinyin: str
    name_ipa: str
    name_english: str
    theme: str                              # Character theme (water, fire, etc.)
    pilgrim_guide: str                      # Which pilgrim teaches here
    characters: List[Character] = field(default_factory=list)
    description: str = ""
    
    def to_dict(self) -> Dict:
        result = asdict(self)
        result['characters'] = [c.to_dict() for c in self.characters]
        return result


@dataclass
class MemoryPalace:
    """
    记忆宫殿 (Jìyì gōngdiàn) - Memory Palace
    
    A major location from Journey to the West containing multiple stations.
    Maps to real-world ArcGIS coordinates for geographical memory anchoring.
    """
    id: str
    name_chinese: str
    name_pinyin: str
    name_ipa: str
    name_english: str
    description: str
    latitude: float
    longitude: float
    real_location: str                      # Actual place in China
    arcgis_layer: str                       # Layer ID for StoryMap
    stations: List[MemoryStation] = field(default_factory=list)
    philosophical_framework: Dict = field(default_factory=dict)
    
    def to_dict(self) -> Dict:
        result = asdict(self)
        result['stations'] = [s.to_dict() for s in self.stations]
        return result


@dataclass
class LearningProgress:
    """
    学习进度 (Xuéxí jìndù) - Learning Progress
    
    Tracks user progress using spaced repetition algorithm (SM-2 variant).
    """
    character_id: str
    character: str
    phase: LearningPhase
    ease_factor: float = 2.5              # SM-2 ease factor
    interval: int = 1                      # Days until next review
    repetitions: int = 0                   # Successful repetitions
    last_review: Optional[datetime] = None
    next_review: Optional[datetime] = None
    review_history: List[Dict] = field(default_factory=list)
    
    def update_after_review(self, quality: int) -> None:
        """
        Update learning progress after a review session.
        Quality: 0 (complete failure) to 5 (perfect)
        
        Based on SM-2 algorithm with modifications for Chinese characters.
        """
        self.repetitions += 1
        self.last_review = datetime.now()
        
        # Record in history
        self.review_history.append({
            'date': self.last_review.isoformat(),
            'quality': quality,
            'interval': self.interval
        })
        
        # Update ease factor
        self.ease_factor = max(
            1.3,
            self.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        )
        
        # Update interval
        if quality < 3:
            self.repetitions = 0
            self.interval = 1
        else:
            if self.repetitions == 1:
                self.interval = 1
            elif self.repetitions == 2:
                self.interval = 6
            else:
                self.interval = int(self.interval * self.ease_factor)
        
        # Set next review date
        self.next_review = self.last_review + timedelta(days=self.interval)
        
        # Update phase based on repetitions
        if self.repetitions >= 5 and quality >= 4:
            self.phase = LearningPhase.MASTER


class MemoryPalaceDatabase:
    """
    记忆宫殿数据库 (Jìyì gōngdiàn shùjùkù)
    
    SQLite database for storing learning progress and user data.
    Supports offline-first approach with sync capability.
    """
    
    def __init__(self, db_path: str = "memory_palace.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self._create_tables()
    
    def _create_tables(self) -> None:
        """Create database tables if they don't exist"""
        cursor = self.conn.cursor()
        
        # Learning progress table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS learning_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                character_id TEXT NOT NULL,
                character TEXT NOT NULL,
                phase TEXT NOT NULL,
                ease_factor REAL DEFAULT 2.5,
                interval INTEGER DEFAULT 1,
                repetitions INTEGER DEFAULT 0,
                last_review TEXT,
                next_review TEXT,
                review_history TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, character_id)
            )
        """)
        
        # User preferences table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                user_id TEXT PRIMARY KEY,
                preferred_dialect TEXT DEFAULT 'mandarin',
                show_pinyin INTEGER DEFAULT 1,
                show_english INTEGER DEFAULT 1,
                daily_goal INTEGER DEFAULT 10,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Session history table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS session_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                session_start TEXT NOT NULL,
                session_end TEXT,
                characters_studied INTEGER DEFAULT 0,
                characters_mastered INTEGER DEFAULT 0,
                palace_id TEXT,
                station_id TEXT
            )
        """)
        
        self.conn.commit()
    
    def save_progress(self, user_id: str, progress: LearningProgress) -> None:
        """Save or update learning progress"""
        cursor = self.conn.cursor()
        
        cursor.execute("""
            INSERT OR REPLACE INTO learning_progress 
            (user_id, character_id, character, phase, ease_factor, 
             interval, repetitions, last_review, next_review, review_history, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            progress.character_id,
            progress.character,
            progress.phase.value,
            progress.ease_factor,
            progress.interval,
            progress.repetitions,
            progress.last_review.isoformat() if progress.last_review else None,
            progress.next_review.isoformat() if progress.next_review else None,
            json.dumps(progress.review_history),
            datetime.now().isoformat()
        ))
        
        self.conn.commit()
    
    def get_due_characters(self, user_id: str, limit: int = 20) -> List[LearningProgress]:
        """Get characters due for review"""
        cursor = self.conn.cursor()
        now = datetime.now().isoformat()
        
        cursor.execute("""
            SELECT character_id, character, phase, ease_factor, interval,
                   repetitions, last_review, next_review, review_history
            FROM learning_progress
            WHERE user_id = ? AND (next_review IS NULL OR next_review <= ?)
            ORDER BY next_review ASC
            LIMIT ?
        """, (user_id, now, limit))
        
        results = []
        for row in cursor.fetchall():
            progress = LearningProgress(
                character_id=row[0],
                character=row[1],
                phase=LearningPhase(row[2]),
                ease_factor=row[3],
                interval=row[4],
                repetitions=row[5],
                last_review=datetime.fromisoformat(row[6]) if row[6] else None,
                next_review=datetime.fromisoformat(row[7]) if row[7] else None,
                review_history=json.loads(row[8]) if row[8] else []
            )
            results.append(progress)
        
        return results
    
    def get_statistics(self, user_id: str) -> Dict:
        """Get learning statistics for a user"""
        cursor = self.conn.cursor()
        
        # Total characters studied
        cursor.execute("""
            SELECT COUNT(*) FROM learning_progress WHERE user_id = ?
        """, (user_id,))
        total_studied = cursor.fetchone()[0]
        
        # Characters mastered
        cursor.execute("""
            SELECT COUNT(*) FROM learning_progress 
            WHERE user_id = ? AND phase = 'master'
        """, (user_id,))
        mastered = cursor.fetchone()[0]
        
        # Characters due today
        cursor.execute("""
            SELECT COUNT(*) FROM learning_progress
            WHERE user_id = ? AND next_review <= ?
        """, (user_id, datetime.now().isoformat()))
        due_today = cursor.fetchone()[0]
        
        # Calculate retention rate
        cursor.execute("""
            SELECT review_history FROM learning_progress WHERE user_id = ?
        """, (user_id,))
        
        total_reviews = 0
        successful_reviews = 0
        for row in cursor.fetchall():
            history = json.loads(row[0]) if row[0] else []
            for review in history:
                total_reviews += 1
                if review.get('quality', 0) >= 3:
                    successful_reviews += 1
        
        retention_rate = (
            successful_reviews / total_reviews * 100 
            if total_reviews > 0 else 0
        )
        
        return {
            'total_studied': total_studied,
            'mastered': mastered,
            'due_today': due_today,
            'retention_rate': round(retention_rate, 1),
            'total_reviews': total_reviews
        }


class RicciCharacterAnalyzer:
    """
    利瑪竇字符分析器 (Lì Mǎdòu zìfú fēnxīqì)
    
    Implements Matteo Ricci's method of character decomposition.
    
    From "The Memory Palace of Matteo Ricci":
    "If one could learn quite swiftly to subdivide each ideograph into 
    component parts, each of which also had a separate meaning, then it 
    would be easy for someone well trained in mnemonic art to make each 
    ideograph into a memory image."
    """
    
    # Kangxi radicals (simplified mapping)
    RADICALS = {
        1: ('一', 'yī', 'one', 1),
        4: ('丿', 'piě', 'slash', 1),
        9: ('人', 'rén', 'person', 2),
        30: ('口', 'kǒu', 'mouth', 3),
        37: ('大', 'dà', 'big', 3),
        38: ('女', 'nǚ', 'woman', 3),
        40: ('宀', 'mián', 'roof', 3),
        50: ('巾', 'jīn', 'cloth', 3),
        61: ('心', 'xīn', 'heart', 4),
        72: ('日', 'rì', 'sun', 4),
        74: ('月', 'yuè', 'moon', 4),
        75: ('木', 'mù', 'tree', 4),
        85: ('水', 'shuǐ', 'water', 4),
        86: ('火', 'huǒ', 'fire', 4),
        96: ('玉', 'yù', 'jade', 5),
        112: ('石', 'shí', 'stone', 5),
        167: ('金', 'jīn', 'metal', 8),
        169: ('门', 'mén', 'gate', 3),
    }
    
    # Common semantic components with meanings
    SEMANTIC_COMPONENTS = {
        '心': ('heart/mind', 'emotions, thoughts, psychology'),
        '忄': ('heart radical', 'feelings, character traits'),
        '水': ('water', 'liquids, flow, cleansing'),
        '氵': ('water radical', 'water-related'),
        '火': ('fire', 'heat, passion, transformation'),
        '灬': ('fire radical', 'cooking, heat'),
        '木': ('wood/tree', 'plants, nature, growth'),
        '金': ('metal/gold', 'metals, weapons, precious'),
        '土': ('earth', 'ground, territory, stability'),
        '日': ('sun', 'time, brightness, day'),
        '月': ('moon', 'night, months, body parts'),
        '口': ('mouth', 'speech, eating, openings'),
        '手': ('hand', 'actions, holding'),
        '扌': ('hand radical', 'manual actions'),
        '目': ('eye', 'vision, watching'),
        '足': ('foot', 'walking, movement'),
        '言': ('speech', 'language, expression'),
        '讠': ('speech radical', 'communication'),
        '人': ('person', 'people, humanity'),
        '亻': ('person radical', 'human-related'),
    }
    
    def analyze_character(self, char: str) -> Dict[str, Any]:
        """
        Analyze a character and provide decomposition data.
        
        Returns information useful for creating memory images.
        """
        analysis = {
            'character': char,
            'components': [],
            'semantic_meaning': '',
            'suggested_imagery': '',
            'mnemonic_connections': []
        }
        
        # Check for known semantic components
        for component, (meaning, extended) in self.SEMANTIC_COMPONENTS.items():
            if component in char:
                analysis['components'].append({
                    'component': component,
                    'meaning': meaning,
                    'extended_meaning': extended
                })
        
        # Generate suggested imagery based on components
        if analysis['components']:
            meanings = [c['meaning'] for c in analysis['components']]
            analysis['semantic_meaning'] = ' + '.join(meanings)
            analysis['suggested_imagery'] = self._generate_imagery_suggestion(
                char, analysis['components']
            )
        
        return analysis
    
    def _generate_imagery_suggestion(
        self, 
        char: str, 
        components: List[Dict]
    ) -> str:
        """Generate a suggested memory image based on character components"""
        
        # Map components to Journey to the West imagery
        imagery_map = {
            'heart/mind': "Sun Wukong's wild heart being tamed",
            'water': "The flowing waters of the Flowing Sand River",
            'fire': "Flames from Laozi's Eight Trigrams Furnace",
            'wood/tree': "The immortal peach trees of Heaven",
            'metal/gold': "Wukong's golden-banded staff Ruyi Jingu Bang",
            'earth': "The Five Elements Mountain pressing down",
            'sun': "The Buddha's radiant palm descending",
            'moon': "Night journey through demon territory",
            'mouth': "Zhu Bajie's endless appetite",
            'person': "Tang Sanzang in meditation",
        }
        
        suggestions = []
        for comp in components:
            meaning = comp['meaning']
            if meaning in imagery_map:
                suggestions.append(imagery_map[meaning])
        
        if suggestions:
            return "Combine: " + " with ".join(suggestions)
        return "Create a vivid scene combining the character's elements"
    
    def create_memory_image(
        self, 
        char: Character,
        station: MemoryStation
    ) -> MemoryImage:
        """
        Create a complete memory image for a character.
        
        Following Bruno's principles:
        - Emotionally striking
        - Dynamic action, not static
        - Connected to well-known figures (pilgrims)
        - Placed in specific location (station in palace)
        """
        analysis = self.analyze_character(char.character)
        
        # Select appropriate pilgrim guide
        pilgrim_guides = {
            'water': 'sha_wujing',
            'fire': 'sun_wukong',
            'earth': 'tang_sanzang',
            'heart/mind': 'sun_wukong',
            'mouth': 'zhu_bajie',
        }
        
        guide = 'sun_wukong'  # Default
        for comp in analysis['components']:
            if comp['meaning'] in pilgrim_guides:
                guide = pilgrim_guides[comp['meaning']]
                break
        
        return MemoryImage(
            scene=analysis['suggested_imagery'],
            action=f"At {station.name_english}, visualize this character coming alive",
            emotion="Let the scene evoke wonder and discovery",
            mnemonic_phrase=f"'{char.pinyin}' ({char.meaning})",
            pilgrim_guide=guide,
            location_in_palace=f"{station.name_english} ({station.name_chinese})"
        )


class ArcGISStoryMapIntegration:
    """
    ArcGIS StoryMaps 集成 (Jíchéng)
    
    Integrates memory palace locations with real-world geography.
    Uses the Silk Road pilgrimage route as geographical memory anchors.
    
    From Ricci: The universalistic attributes of an ideographic script
    could transcend differences in pronunciation - similarly, geographical
    anchoring provides universal reference points.
    """
    
    # Major locations along the Journey to the West route
    PILGRIMAGE_ROUTE = [
        {
            'id': 'changan',
            'name_chinese': '长安',
            'name_pinyin': 'Cháng\'ān',
            'name_english': 'Chang\'an (Xi\'an)',
            'lat': 34.3416,
            'lng': 108.9398,
            'memory_theme': 'beginning_radicals',
            'description': 'Starting point of the journey - foundational characters'
        },
        {
            'id': 'huaguoshan',
            'name_chinese': '花果山',
            'name_pinyin': 'Huāguǒshān',
            'name_english': 'Flower-Fruit Mountain',
            'lat': 34.738,
            'lng': 119.463,
            'memory_theme': 'nature_radicals',
            'description': 'Sun Wukong\'s birthplace - nature and element characters'
        },
        {
            'id': 'tiangong',
            'name_chinese': '天宫',
            'name_pinyin': 'Tiāngōng',
            'name_english': 'Heavenly Palace',
            'lat': 39.9042,
            'lng': 116.4074,
            'memory_theme': 'authority_celestial',
            'description': 'Heaven - authority and celestial characters'
        },
        {
            'id': 'dunhuang',
            'name_chinese': '敦煌',
            'name_pinyin': 'Dūnhuáng',
            'name_english': 'Dunhuang Caves',
            'lat': 40.1425,
            'lng': 94.6618,
            'memory_theme': 'buddhist_art',
            'description': 'Mogao Caves - Buddhist terminology and art'
        },
        {
            'id': 'huoyanshan',
            'name_chinese': '火焰山',
            'name_pinyin': 'Huǒyàn shān',
            'name_english': 'Flaming Mountains',
            'lat': 42.9513,
            'lng': 89.1895,
            'memory_theme': 'fire_heat',
            'description': 'Flaming Mountains - fire and heat characters'
        },
        {
            'id': 'lingshan',
            'name_chinese': '灵山',
            'name_pinyin': 'Língshān',
            'name_english': 'Spirit Mountain (Vulture Peak)',
            'lat': 25.0094,
            'lng': 85.5176,
            'memory_theme': 'enlightenment',
            'description': 'Buddha\'s abode - enlightenment and completion'
        }
    ]
    
    def __init__(self, arcgis_url: Optional[str] = None):
        """
        Initialize ArcGIS connection.
        
        In production, this would connect to an ArcGIS Online account.
        For the prototype, we use mock data.
        """
        self.arcgis_url = arcgis_url
        self.is_connected = False
        # self.gis = GIS(arcgis_url) if arcgis_url else None
    
    def generate_storymap_config(self) -> Dict:
        """
        Generate configuration for ArcGIS StoryMap.
        
        The StoryMap will visualize the pilgrimage route with
        memory palace stations as interactive points.
        """
        return {
            'title': '西遊記記憶宮殿地图',
            'title_english': 'Journey to the West Memory Palace Map',
            'basemap': 'topographic',
            'center': [35.0, 105.0],  # Center of China
            'zoom': 4,
            'layers': [
                {
                    'id': 'pilgrimage_route',
                    'type': 'polyline',
                    'title': '取经之路 | Pilgrimage Route',
                    'style': {
                        'color': '#FFDF00',
                        'width': 3,
                        'style': 'dash'
                    },
                    'data': self._generate_route_geojson()
                },
                {
                    'id': 'memory_palaces',
                    'type': 'point',
                    'title': '记忆宫殿 | Memory Palaces',
                    'popup_template': self._get_popup_template(),
                    'data': self._generate_palaces_geojson()
                },
                {
                    'id': 'progress_heatmap',
                    'type': 'heatmap',
                    'title': '学习热图 | Learning Progress',
                    'visible': False,
                    'description': 'Shows character mastery density by region'
                }
            ],
            'narrative_sections': self._generate_narrative_sections()
        }
    
    def _generate_route_geojson(self) -> Dict:
        """Generate GeoJSON for the pilgrimage route"""
        coordinates = [
            [loc['lng'], loc['lat']] for loc in self.PILGRIMAGE_ROUTE
        ]
        
        return {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coordinates
                },
                'properties': {
                    'name': '取经之路',
                    'name_english': 'Journey to the West Route'
                }
            }]
        }
    
    def _generate_palaces_geojson(self) -> Dict:
        """Generate GeoJSON for memory palace locations"""
        features = []
        
        for loc in self.PILGRIMAGE_ROUTE:
            features.append({
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [loc['lng'], loc['lat']]
                },
                'properties': {
                    'id': loc['id'],
                    'name_chinese': loc['name_chinese'],
                    'name_pinyin': loc['name_pinyin'],
                    'name_english': loc['name_english'],
                    'memory_theme': loc['memory_theme'],
                    'description': loc['description']
                }
            })
        
        return {
            'type': 'FeatureCollection',
            'features': features
        }
    
    def _get_popup_template(self) -> str:
        """HTML template for location popups"""
        return """
        <div class="memory-palace-popup">
            <h3>{name_chinese}</h3>
            <p class="pinyin">{name_pinyin}</p>
            <p class="english">{name_english}</p>
            <hr>
            <p class="theme">主题 | Theme: {memory_theme}</p>
            <p class="description">{description}</p>
            <button class="enter-palace-btn" onclick="enterPalace('{id}')">
                进入宫殿 | Enter Palace
            </button>
        </div>
        """
    
    def _generate_narrative_sections(self) -> List[Dict]:
        """Generate narrative sections for StoryMap scroll"""
        return [
            {
                'id': 'intro',
                'title': '西遊記記憶宮殿',
                'title_english': 'Journey to the West Memory Palace',
                'content': """
                    跟随唐僧取经的脚步，学习汉字。
                    Follow the footsteps of Tang Sanzang's pilgrimage to learn Chinese characters.
                    
                    每个地点都是一座记忆宫殿，充满了生动的西游记形象。
                    Each location is a memory palace filled with vivid Journey to the West imagery.
                """,
                'media': 'intro_map_animation'
            },
            {
                'id': 'method',
                'title': '利瑪竇方法',
                'title_english': 'The Ricci Method',
                'content': """
                    1596年，意大利传教士利玛窦用记忆宫殿方法学习汉字。
                    In 1596, Italian missionary Matteo Ricci used the memory palace method to learn Chinese characters.
                    
                    他发现，每个汉字都可以成为一个记忆图像。
                    He discovered that each Chinese character could become a memory image.
                """,
                'media': 'ricci_portrait'
            }
        ]


class MemoryPalaceService:
    """
    记忆宫殿服务 (Jìyì gōngdiàn fúwù)
    
    Main service class orchestrating all components.
    """
    
    def __init__(
        self,
        db_path: str = "memory_palace.db",
        data_path: str = "data/characters.json"
    ):
        self.db = MemoryPalaceDatabase(db_path)
        self.analyzer = RicciCharacterAnalyzer()
        self.arcgis = ArcGISStoryMapIntegration()
        self.palaces: List[MemoryPalace] = []
        
        if os.path.exists(data_path):
            self._load_data(data_path)
    
    def _load_data(self, path: str) -> None:
        """Load character and palace data from JSON"""
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Parse palaces
        for palace_data in data.get('palaces', []):
            stations = []
            for station_data in palace_data.get('stations', []):
                characters = []
                for char_data in station_data.get('characters', []):
                    # Build Character object
                    memory_image = MemoryImage(
                        **char_data.get('memory_image', {})
                    )
                    
                    dialects = {}
                    for dialect_key, dialect_data in char_data.get('dialects', {}).items():
                        dialects[dialect_key] = PronunciationInfo(**dialect_data)
                    
                    character = Character(
                        character=char_data['character'],
                        pinyin=char_data['pinyin'],
                        ipa=char_data['ipa'],
                        tone=char_data['tone'],
                        meaning=char_data['meaning'],
                        radical_number=char_data['radical_number'],
                        stroke_count=char_data['stroke_count'],
                        memory_image=memory_image,
                        dialects=dialects,
                        stroke_analysis=char_data.get('stroke_analysis', {}),
                        usage_examples=char_data.get('usage_examples', []),
                        compound_characters=char_data.get('compound_characters', []),
                        cultural_note=char_data.get('cultural_note', ''),
                        philosophical_note=char_data.get('philosophical_note', {})
                    )
                    characters.append(character)
                
                station = MemoryStation(
                    id=station_data['id'],
                    name_chinese=station_data['name']['chinese'],
                    name_pinyin=station_data['name']['pinyin'],
                    name_ipa=station_data['name']['ipa'],
                    name_english=station_data['name']['english'],
                    theme=station_data.get('theme', ''),
                    pilgrim_guide=station_data.get('pilgrim_guide', 'sun_wukong'),
                    characters=characters
                )
                stations.append(station)
            
            palace = MemoryPalace(
                id=palace_data['id'],
                name_chinese=palace_data['name']['chinese'],
                name_pinyin=palace_data['name']['pinyin'],
                name_ipa=palace_data['name']['ipa'],
                name_english=palace_data['name']['english'],
                description=palace_data.get('description', ''),
                latitude=palace_data.get('coordinates', {}).get('latitude', 0),
                longitude=palace_data.get('coordinates', {}).get('longitude', 0),
                real_location=palace_data.get('coordinates', {}).get('real_location', ''),
                arcgis_layer=palace_data.get('arcgis_layer', ''),
                stations=stations,
                philosophical_framework=palace_data.get('philosophical_framework', {})
            )
            self.palaces.append(palace)
    
    def get_learning_session(
        self,
        user_id: str,
        palace_id: Optional[str] = None,
        station_id: Optional[str] = None,
        max_characters: int = 10
    ) -> List[Character]:
        """
        Get characters for a learning session.
        
        Combines:
        1. Characters due for review (spaced repetition)
        2. New characters from specified palace/station
        3. Balanced mix of different character types
        """
        characters = []
        
        # Get due characters first
        due = self.db.get_due_characters(user_id, limit=max_characters // 2)
        due_char_ids = {p.character_id for p in due}
        
        # Find character objects for due items
        for palace in self.palaces:
            for station in palace.stations:
                for char in station.characters:
                    if char.get_unique_id() in due_char_ids:
                        characters.append(char)
        
        # Fill remaining with new characters from specified location
        remaining = max_characters - len(characters)
        if remaining > 0:
            target_palace = None
            target_station = None
            
            if palace_id:
                target_palace = next(
                    (p for p in self.palaces if p.id == palace_id), 
                    None
                )
            
            if target_palace and station_id:
                target_station = next(
                    (s for s in target_palace.stations if s.id == station_id),
                    None
                )
            
            # Get new characters
            if target_station:
                for char in target_station.characters[:remaining]:
                    if char.get_unique_id() not in due_char_ids:
                        characters.append(char)
            elif target_palace:
                for station in target_palace.stations:
                    for char in station.characters:
                        if len(characters) >= max_characters:
                            break
                        if char.get_unique_id() not in due_char_ids:
                            characters.append(char)
        
        return characters
    
    def record_review(
        self,
        user_id: str,
        character: Character,
        quality: int  # 0-5 scale
    ) -> LearningProgress:
        """
        Record a review and update learning progress.
        
        Quality scale (following SM-2):
        0 - Complete failure to recall
        1 - Incorrect response; correct one seemed easy to recall
        2 - Incorrect response; correct one remembered after difficulty
        3 - Correct response with serious difficulty
        4 - Correct response after hesitation
        5 - Perfect response
        """
        char_id = character.get_unique_id()
        
        # Get or create progress
        progress = LearningProgress(
            character_id=char_id,
            character=character.character,
            phase=LearningPhase.OVERVIEW
        )
        
        # Update with review result
        progress.update_after_review(quality)
        
        # Save to database
        self.db.save_progress(user_id, progress)
        
        return progress
    
    def get_storymap_config(self) -> Dict:
        """Get ArcGIS StoryMap configuration"""
        return self.arcgis.generate_storymap_config()
    
    def export_to_json(self) -> str:
        """Export all palace data to JSON"""
        data = {
            'metadata': {
                'title': '西遊記記憶宮殿',
                'version': '1.0.0',
                'exported_at': datetime.now().isoformat()
            },
            'palaces': [p.to_dict() for p in self.palaces]
        }
        return json.dumps(data, ensure_ascii=False, indent=2)


# Flask API for frontend integration (would be a separate file in production)
"""
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

service = MemoryPalaceService()

@app.route('/api/palaces', methods=['GET'])
def get_palaces():
    return jsonify([p.to_dict() for p in service.palaces])

@app.route('/api/session', methods=['POST'])
def get_session():
    data = request.json
    characters = service.get_learning_session(
        user_id=data.get('user_id', 'default'),
        palace_id=data.get('palace_id'),
        station_id=data.get('station_id'),
        max_characters=data.get('max_characters', 10)
    )
    return jsonify([c.to_dict() for c in characters])

@app.route('/api/review', methods=['POST'])
def record_review():
    data = request.json
    # In production, would retrieve full character object
    progress = service.record_review(
        user_id=data.get('user_id', 'default'),
        character=Character(**data['character']),
        quality=data.get('quality', 3)
    )
    return jsonify({
        'next_review': progress.next_review.isoformat() if progress.next_review else None,
        'interval': progress.interval
    })

@app.route('/api/storymap', methods=['GET'])
def get_storymap():
    return jsonify(service.get_storymap_config())

@app.route('/api/statistics/<user_id>', methods=['GET'])
def get_statistics(user_id):
    return jsonify(service.db.get_statistics(user_id))

if __name__ == '__main__':
    app.run(debug=True, port=5000)
"""


if __name__ == "__main__":
    # Example usage
    service = MemoryPalaceService(
        db_path="memory_palace.db",
        data_path="src/data/characters.json"
    )
    
    print("西遊記記憶宮殿 | Journey to the West Memory Palace")
    print("=" * 50)
    
    # Print palace information
    for palace in service.palaces:
        print(f"\n🏯 {palace.name_chinese} ({palace.name_pinyin})")
        print(f"   {palace.name_english}")
        print(f"   Location: {palace.real_location}")
        print(f"   Coordinates: {palace.latitude}, {palace.longitude}")
        
        for station in palace.stations:
            print(f"\n   📍 {station.name_chinese} ({station.name_english})")
            print(f"      Theme: {station.theme}")
            print(f"      Guide: {station.pilgrim_guide}")
            print(f"      Characters: {len(station.characters)}")
            
            for char in station.characters[:3]:
                print(f"\n      字 {char.character} ({char.pinyin}) - {char.meaning}")
                print(f"         Radical #{char.radical_number}, {char.stroke_count} strokes")
                if char.memory_image.scene:
                    print(f"         Scene: {char.memory_image.scene[:60]}...")
    
    # Generate StoryMap config
    storymap = service.get_storymap_config()
    print(f"\n\n🗺️ StoryMap Configuration Generated")
    print(f"   Layers: {len(storymap['layers'])}")
    print(f"   Narrative Sections: {len(storymap['narrative_sections'])}")
