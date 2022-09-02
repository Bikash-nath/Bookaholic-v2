import sys
import os
from django.db.models import Q

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bookstore.models import Series, Book, Author
from .fetch_series import series


def db_loader():
    all_series = series()
    for i in range(len(all_series)):
        try:
            series_list = all_series[i]
            for i in range(len(series_list)):
                d = series_list[i]   # d is dict containing series data
                author = Author.objects.get(name=d['author'])
                book_set = Book.objects.filter(id=None)  # books of a series
                for title in d['books']:
                    books = Book.objects.filter(Q(title__icontains=title), Q(author=author))
                    if len(books) == 0:
                        books |= Book.objects.filter(
                            Q(title__icontains=title.replace("'", '')), Q(author=author))
                    if not len(books):
                        print(title, '->', d['author'], 'not found in db')
                    book_set |= books

                if len(book_set) != len(d['books']):
                    raise Exception('⛔', d['title'], 'series->', d['author'])
                s = Series.objects.create(
                    title=d['title'], rating=d['rating'], author=author, description=d['description'])
                for book in book_set:
                    book.series = s
                    book.save()
                print(f"✅'{d['title']}' successfully loaded.")

        except Exception as e:
            print(f"❌Loading failed:- {e}")
