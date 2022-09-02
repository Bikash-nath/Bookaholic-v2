from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
# from passlib.handlers.django import sha56

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User
from bookstore.models import UserProfile, Author, Book, Series, Genre, Notification, Cart, Address, Seller
from bookstore.serializers.user_serializer import UserDetailSerializer, CartSerializer, BookSerializer
from bookstore.serializers.order_serializer import AddressSerializer


@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def get_user_detail(request):
    userprofile = request.user.userprofile_set.all()[0]
    serializer = UserDetailSerializer(userprofile, many=False)
    return Response(serializer.data)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def follow_author(request):
    userprofile = request.user.userprofile_set.all()[0]
    author_id = request.data['authorId']
    author = Author.objects.get(id=author_id)
    author_exists = userprofile.authors.all().filter(id=author.id).exists()

    if not author_exists:
        userprofile.authors.add(author)
        author.total_followers += 1
    else:
        userprofile.authors.remove(author)
        author.total_followers -= 1

    author.save()
    serializer = UserDetailSerializer(userprofile, many=False)
    return Response(serializer.data)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def favourite_book(request):
    userprofile = request.user.userprofile_set.all()[0]
    book_id = request.data['bookId']
    book = Book.objects.get(id=book_id)

    book_exists = userprofile.books.all().filter(id=book.id).exists()

    if not book_exists:
        userprofile.books.add(book)
    else:
        userprofile.books.remove(book)

    serializer = UserDetailSerializer(userprofile, many=False)
    return Response(serializer.data)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def favourite_genre(request):
    userprofile = request.user.userprofile_set.all()[0]
    genre = request.data['genre']
    genre_obj = Genre.objects.get(genre=genre)
    genre_exists = userprofile.genres.all().filter(id=genre_obj.id).exists()

    if not genre_exists:
        userprofile.genres.add(genre_obj)
    else:
        userprofile.genres.remove(genre_obj)

    serializer = UserDetailSerializer(userprofile, many=False)
    return Response(serializer.data)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def favourite_genrelist(request):
    try:
        userprofile = request.user.userprofile_set.all()[0]
        new_genres = request.data['genreList']
        user_genres = userprofile.genres.all()
        print('GENRE_LIST:\n ', new_genres)
        for g in new_genres:
            if not userprofile.genres.filter(genre=g).exists():
                genre = Genre.objects.get(genre=g)
                userprofile.genres.add(genre)

        for g in user_genres:
            if g.genre not in new_genres:
                # removing user genres if not present in new_genres
                userprofile.genres.remove(g)

        print('User Genres:\n', userprofile.genres.all())
        serializer = UserDetailSerializer(userprofile, many=False)
        return Response(serializer.data)
    except e:
        print('🔔', e)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def favourite_series(request):
    userprofile = request.user.userprofile_set.all()[0]
    series_id = request.data['seriesId']
    series = Series.objects.get(id=series_id)
    series_exists = userprofile.series.all().filter(id=series.id).exists()
    print('🔽Fav. Series set:-', userprofile.series.all())
    if not series_exists:
        userprofile.series.add(series)
    else:
        userprofile.series.remove(series)
    print('✅Fav. Series set:-', userprofile.series.all())
    serializer = UserDetailSerializer(userprofile, many=False)
    print('🔔serializer:-', serializer)
    return Response(serializer.data)


@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def get_cart_items(request):
    userprofile = request.user.userprofile_set.all()[0]
    cart_items = userprofile.cart_items.all()
    serializer = CartSerializer(cart_items, many=True)
    return Response(serializer.data)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def add_cart_item(request):
    try:
        userprofile = request.user.userprofile_set.all()[0]
        print("Req.:-", request.data)
        book = Book.objects.get(id=request.data['bookId'])
        seller = Seller.objects.get(id=request.data['sellerId'])
        cart_item = Cart.objects.filter(book=book)
        qty = request.data['qty']
        print("cart_item.:-", cart_item)
        print('⭐ DATA-\nquantity:-', qty, '\nbook:-', book)
        if cart_item.exists():
            cart_item = cart_item[0]
            if request.data['screen'] != "cart":
                qty = cart_item.quantity + int(qty)
                if qty > 10:
                    qty = 10
                    msg = f"'{cart_item.book.title[:35]}' already exist in cart. Item quantity cannot be more than 10"
                else:
                    msg = f"'{cart_item.book.title[:35]}' already exist in cart. We've increased quantity by {qty}"
            else:
                msg = f"'{cart_item.book.title[:35]}' quantity changed to {qty}"
                qty = int(qty)
            cart_item.quantity = qty
            cart_item.save()
        else:
            cart_item = Cart.objects.create(
                user=userprofile, book=book, quantity=qty, seller=seller)
            msg = f"'{cart_item.book.title[:35]}' added in cart"

        if qty >= 1 and request.data['screen'] != "book":
            msg = f"{qty} items added in cart"
        serializer = CartSerializer(cart_item, many=False)
        return Response({'message': msg, 'item': serializer.data})
    except Exception as e:
        print('🔽-', e)


@ api_view(['DELETE'])
@ permission_classes([IsAuthenticated])
def remove_cart_item(request, pk):
    try:
        Cart.objects.get(book=pk).delete()
        return Response({'book_id': pk})
    except Exception as e:
        print('🔽-', e)


@ api_view(['DELETE'])
@ permission_classes([IsAuthenticated])
def clear_cart_items(request):
    try:
        userprofile = request.user.userprofile_set.all()[0]
        userprofile.cart_items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print('🔽-', e)


@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def get_wishlist_items(request):
    try:
        userprofile = request.user.userprofile_set.all()[0]
        books = userprofile.wishlist.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    except Exception as e:
        print('🔽-', e)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def add_wishlist_item(request):
    try:
        userprofile = request.user.userprofile_set.all()[0]
        wishlist_item = userprofile.wishlist.filter(id=request.data['bookId'])
        if wishlist_item.exists():
            serializer = BookSerializer(wishlist_item[0], many=False)
            msg = f"'{wishlist_item[0].title[:35]}' already exists in wishlist"
        else:
            book = Book.objects.get(id=request.data['bookId'])
            userprofile.wishlist.add(book)
            serializer = BookSerializer(book, many=False)
            msg = f"'{book.title[:35]}' added in wishlist"

        if request.data['totalItems'] != 1:
            msg = f"{request.data['totalItems']} items added in wishlist"
        return Response({'message': msg, 'item': serializer.data})
    except Exception as e:
        print('🔽-', e)


@ api_view(['DELETE'])
@ permission_classes([IsAuthenticated])
def remove_wishlist_item(request, pk):
    try:
        userprofile = request.user.userprofile_set.all()[0]
        book = Book.objects.get(id=pk)
        userprofile.wishlist.remove(book)
        return Response({'book_id': pk})
    except Exception as e:
        print('🔽-', e)


@ api_view(['DELETE'])
@ permission_classes([IsAuthenticated])
def clear_wishlist_items(request):
    try:
        userprofile = request.user.userprofile_set.all()[0]
        userprofile.wishlist.remove(*userprofile.wishlist.all())
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print('🔽-', e)
