import sys
import os
from random import randint

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from bookstore.models import Book, Author, Seller, SellerBook, Genre, Format
from django.contrib.auth.models import User
from .fetch_books import isbn_books, author_books, title_books


def db_loader():
    # data = author_books(author)
    # data = isbn_books()
    data = title_books()

    for i in range(len(data)):
        try:
            d = data[i]
            u1 = User.objects.all()[0]
            seller = Seller.objects.all()[randint(0, len(Seller.objects.all()) - 1)]
            sellerbook = SellerBook.objects.create(seller=seller, discount=d['discount'], price=d['price'], count_in_stock=d['stock'],
                                                   delivers_in=randint(5, 7), replacement=True, returnable=rt=True if randint(0, 1) else False)
            try:
                a = Author.objects.get(name__contains=d['author'])
            except Exception as e:
                # author name didn't match any author in DB
                raise Exception(f"'{d.get('author')}', {e}.")

            if Book.objects.filter(title=d['title']):
                print(f"❗'{d['title']}' already exists in DB.")
                continue

            book = Book.objects.create(user=u1, author=a, sellerbook=sellerbook, title=d['title'], ISBN_10=d['ISBN_10'],
                                       ISBN_13=d['ISBN_13'], image=d['image'], orignal_price=d['orignal_price'],
                                       language=d['language'], publisher=d['publisher'], publication_date=d['publication_date'],
                                       pages=d['pages'], origin=d['origin'], age_group=d['age_group'], dimensions=d['dimensions'],
                                       description=d['description'], rating=d['rating'], num_reviews=d['num_reviews'])

            for genre in d['genres']:
                genres = Genre.objects.filter(genre__contains=genre)
                if len(genres):
                    g = genres[0]
                else:
                    genres = genre.split(
                        ' ') + list(g[:int(len(g) / 2 + 1)] for g in genre.split(' '))
                    genre_list = Genre.objects.filter(
                        reduce(operator.or_, (Q(genre__icontains=x) for x in genres))).order_by('genre')  # order_by('book_set')
                    index = int(input(
                        f'Select index of genre for this book:-\n {list((i,genre_list[i].genre) for i in range(len(genre_list)))}\n->'))
                    if index != -1:
                        g = genre_list[index]
                    else:
                        g = Genre.objects.create(genre=genre)
                book.genres.add(g)

            for format, link in d['formats'].items():
                Format.objects.create(format=format, link=link, book=book)
            print(f"✅'{d['title']}' successfully loaded.")
        except Exception as e:
            print(f"❌Loading failed:- {e}")
