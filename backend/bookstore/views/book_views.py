from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
import operator
from functools import reduce

from bookstore.models import Author, Book, Series, Genre, Review
from bookstore.serializers.books_serializers import BookSerializer, BookDetailSerializer, GenreSerializer, SeriesSerializer, SeriesDetailSerializer


@api_view(['GET'])
def get_bestseller_books(request):
	ordering = request.query_params.get('order')
    if ordering == None:
        ordering = '-rating'
	print('🔽Order-', ordering)
    total_books = Book.objects.filter(rating__gte=4).order_by(ordering)
	print('⭐Books-', total_books)
    page = request.query_params.get('page')  # number
    paginator = Paginator(total_books, 30)
    try:
        books = paginator.page(page)
    except PageNotAnInteger:
        books = paginator.page(1)
    except EmptyPage:
        books = paginator.page(paginator.num_pages)
    if page == None:
        page = 1
    page = int(page)
    serializer = BookSerializer(books, many=True)
    return Response({'books': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET'])
def get_indian_books(request):
    ordering = request.query_params.get('order')
    if ordering == None:
        ordering = '-rating'
	print('🔽Order-', ordering)
    total_books = Book.objects.filter(origin__icontains='in').order_by(ordering)
	print('⭐Books-', total_books)    
    page = request.query_params.get('page')  # number
    paginator = Paginator(total_books, 30)
    try:
        books = paginator.page(page)
    except PageNotAnInteger:
        books = paginator.page(1)
    except EmptyPage:
        books = paginator.page(paginator.num_pages)
    if page == None:
        page = 1
    page = int(page)
    serializer = BookSerializer(books, many=True)
    return Response({'books': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET'])
def get_genre_books(request, genre):
    ordering = request.query_params.get('order')
    if ordering == None:
        ordering = '-rating'
    genres = genre.split(' & ')
    genre_list = Genre.objects.filter(
        reduce(operator.or_, (Q(genre__icontains=x) for x in genres)))

    total_books = Book.objects.filter(id=None)
    for genre in genre_list:
        total_books |= genre.book_set.all().order_by(ordering)

    page = request.query_params.get('page')  # number
    paginator = Paginator(total_books, 30)
    try:
        books = paginator.page(page)
    except PageNotAnInteger:
        books = paginator.page(1)	# if page no. is not provided
    except EmptyPage:        
        books = paginator.page(paginator.num_pages)		# if page no. exceeds total number of pages
    if page == None:
        page = 1
    page = int(page)

    serializer = BookSerializer(books, many=True)
    return Response({'books': serializer.data, 'page': page, 'pages': paginator.num_pages})


@ api_view(['GET'])
def get_similar_books(request, pk):
    book = Book.objects.get(id=pk)
    books = Book.objects.filter(Q(author=book.author) | Q(genres__in=[*book.genres.all()]),
                                ~Q(id=pk)).order_by('rating')[:18]
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@ api_view(['GET'])
def search_books(request):
    query = request.query_params.get('keyword')  # /?keyword=term&page=1
    if query == None:
        query = ''
    ordering = request.query_params.get('order')
    if ordering == None:
        ordering = '-rating'
	print('🔽Order-', ordering)        
    total_books = Book.objects.filter(
        title__icontains=query).order_by(ordering)
    total_books |= Book.objects.filter(ISBN_10__icontains=query)
    total_books |= Book.objects.filter(ISBN_13__icontains=query)
	
	print('⭐Books-', total_books)    
    for author in Author.objects.filter(name__icontains=query):
        total_books |= author.book_set.all().order_by(ordering)

    for genre in Genre.objects.filter(genre__icontains=query):
        total_books |= genre.book_set.all().order_by(ordering)

    page = request.query_params.get('page')  # number
    paginator = Paginator(total_books, 30)

    try:
        books = paginator.page(page)
    except PageNotAnInteger:
        # if page no. is not provided
        books = paginator.page(1)
    except EmptyPage:
        # if page no. exceeds total number of pages
        books = paginator.page(paginator.num_pages)
    if page == None:
        page = 1
    page = int(page)

    serializer = BookSerializer(books, many=True)
    return Response({'books': serializer.data, 'page': page,
                     'pages': paginator.num_pages, 'total_books': len(total_books)})


@ api_view(['GET'])
def get_book(request, pk):
    book = Book.objects.get(id=pk)
    serializer = BookDetailSerializer(book, many=False)
    return Response(serializer.data)


@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def create_book_review(request, pk):
    user = request.user
    book = Book.objects.get(id=pk)
    data = request.data

    # (1) Review already exits
    review_exists = book.review_set.filter(user=user).exists()

    if review_exists:
        content = {'error_message': 'You have already submitted a review.'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # (2) No rating or 0 given
    elif data['rating'] == 0:
        content = {'error_message': 'Please select a value between 1 and 5.'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # (3) Create Review
    else:
        review = Review.objects.create(
            user=user,
            book=book,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = Review.objects.all()
        book.num_reviews = len(reviews)

        total = 0
        for review in reviews:
            total += review.rating

        book.rating = total / len(reviews)
        book.save()

        return Response('Review added successfully.')


@ api_view(['GET'])
def get_series(request, pk):
    series = Series.objects.get(id=pk)
    serializer = SeriesDetailSerializer(series, many=False)
    return Response(serializer.data)


@ api_view(['GET'])
def get_similar_series(request, pk):
    series = Series.objects.get(id=pk)
    similar_series = Series.objects.filter(
        Q(author=series.author), ~Q(id=pk)).order_by('-rating')
    serializer = SeriesSerializer(similar_series, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_serieslist(request):
    ordering = request.query_params.get('order')  # /?order=term
    if ordering == None:
        ordering = '-rating'
    if request.query_params.get('results'):
        results = int(request.query_params.get('results'))
    else:
        results = None
    all_series = Series.objects.all().order_by(ordering)[0:results]

    page = request.query_params.get('page')  # number
    paginator = Paginator(all_series, 30)
    try:
        series = paginator.page(page)
    except PageNotAnInteger:
        # if page no. is not provided
        series = paginator.page(1)
    except EmptyPage:
        # if page no. exceeds total number of pages
        series = paginator.page(paginator.num_pages)
    if page == None:
        page = 1
    page = int(page)
    serializer = SeriesSerializer(series, many=True)
    return Response({'series_list': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET'])
def search_series(request):
    query = request.query_params.get('keyword')
    ordering = request.query_params.get('order')  # /?order=term
    if ordering == None:
        ordering = '-rating'
    all_series = Author.objects.filter(title__icontains=query).order_by(ordering)
    page = request.query_params.get('page')
    paginator = Paginator(all_series, 15)  # or 12
    try:
        series = paginator.page(page)
    except PageNotAnInteger:
        series = paginator.page(1)
    except EmptyPage:
        series = paginator.page(paginator.num_pages)
    if page == None:
        page = 1
    page = int(page)

    serializer = SeriesSerializer(series, many=True)
    return Response({'series_list': serializer.data, 'page': page,
                     'pages': paginator.num_pages, 'total_series': len(all_series)})


@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def create_series_review(request, pk):
    user = request.user
    series = Series.objects.get(id=pk)
    data = request.data

    # (1) Review already exits
    review_exists = Series.review_set.filter(user=user).exists()

    if review_exists:
        content = {'error_message': 'You have already submitted a review.'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # (2) No rating or 0 given
    elif data['rating'] == 0:
        content = {'error_message': 'Please select a value between 1 and 5.'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # (3) Create Review
    else:
        review = Review.objects.create(
            user=user,
            series=series,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = Review.objects.all()
        series.num_reviews = len(reviews)

        total = 0
        for review in reviews:
            total += review.rating

        series.rating = total / len(reviews)
        series.save()

        return Response('Review added successfully.')
