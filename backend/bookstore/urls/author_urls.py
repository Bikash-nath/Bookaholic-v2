from django.urls import path
from bookstore.views import author_views as views

urlpatterns = [
    path('', views.get_authors, name='get-authors'),
    path('search/', views.search_authors, name='search-authors'),
    path('<str:pk>/', views.get_author, name='author'),
    path('<str:pk>/similar/', views.get_similar_authors, name='similar-authors'),
    path('<str:pk>/books/', views.get_author_books, name='author-books'),
    path('<str:pk>/reviews/', views.create_author_review, name='create-review'),
]
