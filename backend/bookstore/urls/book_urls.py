from django.urls import path
from bookstore.views import book_views as views

urlpatterns = [
    path('bestseller/', views.get_bestseller_books, name='bestsellers'),
    path('indian/', views.get_indian_books, name='indian-books'),
    path('search/', views.search_books, name='search-books'),
    path('serieslist/', views.get_serieslist, name='serieslist'),

    path('<str:pk>/', views.get_book, name='book'),
    path('<str:pk>/similar/', views.get_similar_books, name='similar-book'),
    path('genre/<str:genre>/', views.get_genre_books, name='books-by-genre'),
    path('<str:pk>/reviews/', views.create_book_review, name='create-book-review'),

    path('series/<str:pk>/', views.get_series, name='get-series'),
    path('series/<str:pk>/similar/', views.get_similar_series, name='similar-series'),
    path('series/search/', views.search_series, name='search-series'),
    path('series/<str:pk>/reviews/', views.create_series_review, name='create-series-review'),
]
