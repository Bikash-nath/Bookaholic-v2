from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from bookstore.models import Book, Author, Series, Genre, Format, Review, Seller, SellerBook


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'biography', 'name', 'image_sm']


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = '__all__'


class SellerBookSerializer(serializers.ModelSerializer):
    seller = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SellerBook
        fields = '__all__'

    def get_seller(self, obj):
        serializer = SellerSerializer(obj.seller, many=False)
        return serializer.data


class BookSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)
    sellerbook = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'image', 'orignal_price', 'rating',
                  'num_reviews', 'author', 'sellerbook']

    def get_author(self, obj):
        serializer = AuthorSerializer(obj.author, many=False)
        return serializer.data

    def get_sellerbook(self, obj):
        serializer = SellerBookSerializer(obj.sellerbook, many=False)
        return serializer.data


class SeriesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Series
        fields = ['id', 'title', 'image']


class SeriesDetailSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)
    books = serializers.SerializerMethodField(read_only=True)
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Series
        fields = '__all__'

    def get_author(self, obj):
        serializer = AuthorSerializer(obj.author, many=False)
        return serializer.data

    def get_books(self, obj):
        books = obj.book_set.all()
        serializer = BookSerializer(books, many=True)
        return serializer.data

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class AuthorDetailSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    genres = serializers.SerializerMethodField(read_only=True)
    books = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Author
        fields = '__all__'

    def get_genres(self, obj):
        serializer = GenreSerializer(obj.genres.all(), many=True)
        return serializer.data

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def get_books(self, obj):
        books = obj.book_set.all()[:12]
        serializer = BookSerializer(books, many=True)
        return serializer.data


class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = ['id', 'genre']


# class GenreBooksSerializer(serializers.ModelSerializer):
#    books = serializers.SerializerMethodField(read_only=True)

#    class Meta:
#       model = Genre
#       fields = ['books']

#    def get_books(self, obj):
#       book_set = obj.book_set.all()
#       serializer = BookSerializer(book_set, many=True)
#       return serializer.data


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class FormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Format
        fields = ['format', 'link']

    # Merging 2 serializers
    # class SellerBookSerializer(serializers.ModelSerializer):
    #     class Meta:
    #         model = SellerBook
    #         fields = '__all__'

    # model_b = ModelBTempSerializer()

    # class Meta:
    #     model = ModelA
    #     fields = '__all__'

    # def create(self, validated_data):
    #     model_b_data = validated_data.pop('model_b')
    #     model_a_instance = ModelA.objects.create(**validated_data)
    #     ModelB.objects.create(model_a_field=model_a_instance,
    #                           fieldB3=True,
    #                           field4=model_a_instance.field4,
    #                           **model_b_data)
    #     return model_a_instance


class BookDetailSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    genres = serializers.SerializerMethodField(read_only=True)
    formats = serializers.SerializerMethodField(read_only=True)
    author = serializers.SerializerMethodField(read_only=True)
    series = serializers.SerializerMethodField(read_only=True)
    sellerbook = SellerBookSerializer()

    class Meta:
        model = Book
        fields = '__all__'

    def get_author(self, obj):
        serializer = AuthorSerializer(obj.author, many=False)
        return serializer.data

    def get_genres(self, obj):
        serializer = GenreSerializer(obj.genres.all(), many=True)
        return serializer.data

    def get_formats(self, obj):
        serializer = FormatSerializer(obj.format_set.all(), many=True)
        return serializer.data

    def get_series(self, obj):
        serializer = SeriesSerializer(obj.series, many=False)
        return serializer.data

    def get_sellerbook(self, obj):
        serializer = SellerBookSerializer(obj.sellerbook, many=False)
        return serializer.data

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data
