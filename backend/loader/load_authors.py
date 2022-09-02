import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bookstore.models import Author, Genre
from .fetch_authors import authors


def db_loader():
    data = authors()
    for i in range(len(data)):
        try:
            d = data[i]
            author_exists = Author.objects.filter(name=d['name']).exists()
            if author_exists:
                raise Exception(f"❗{d['name']} already present in DB.")

            author = Author.objects.create(name=d['name'], image_sm=d['image_sm'], image_lg=d['image_lg'], biography=d['biography'], language=d['language'],
                                           origin=d['origin'], dob=d.get('Born'), website=d.get('Website'), twitter=d.get('Twitter'),
                                           num_reviews=0, rating=d['rating'], total_followers=d['total_followers'], top_book=d['top_book'],)

            for genre in d['genres']:
                genres = Genre.objects.filter(genre__contains=genre)
                if len(genres):
                    g = genres[0]
                else:
                    g = Genre.objects.create(genre=genre)
                author.genres.add(g)
            print(f"✅'{d['name']}' successfully loaded.")

        except Exception as e:
            print(f"❌Loading failed. Error: {e}")
