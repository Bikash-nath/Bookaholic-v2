import sys
import os
from pathlib import Path
import random

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bookstore.models import Genre

genrelist = ["Action & Adventures",
             "Crime & Thriller",
             "Literature & Fiction",
             "Sci-fi & Fantasy",
             "Children & Young Adult",
             "Biographies & Memoirs",
             "Romance",
             "Indian Writing",
             "Business & Economics",
             "Family & Personal Development",
             "Study Aids & Exam Prep",
             "Politics & Social Sciences",
             "Action & Adventures",
             "Humor",
             "Arts",
             "Film & Photography",
             "Language",
             "Linguistics & Writing",
             "Biographies",
             "Diaries & True Accounts",
             "Law",
             "Business & Economics",
             "Literature & Fiction",
             "Politics",
             "Children & Young Adult",
             "Religion",
             "Comics & Mangas",
             "Romance",
             "Computing",
             "Internet & Digital Media",
             "School Books",
             "Crafts",
             "Home & Lifestyle",
             "Sciences",
             "Technology & Medicine",
             "Crime",
             "Thriller & Mystery",
             "Fantasy",
             "Horror & Science Fiction",
             "Sports",
             "Health",
             "Historical Fiction",
             "History",
             "Travel",
             "Society & Social Sciences",
             "Family & Personal Development",
             "Study Aids & Exam Prep", ]


def db_loader():
    for genre in genrelist:
        genres = Genre.objects.filter(genre=genre)
        if not len(genres):
            g = Genre.objects.create(genre=genre)
