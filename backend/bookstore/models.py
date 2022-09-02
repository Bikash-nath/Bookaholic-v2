from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.validators import MinLengthValidator


class Genre(models.Model):
    genre = models.CharField(max_length=30)

    def __str__(self):
        return self.genre


class Author(models.Model):
    name = models.CharField(max_length=100)
    image_sm = models.ImageField(
        upload_to='author_img', default='author_img/author-sm.jpg')
    image_lg = models.ImageField(
        upload_to='author_img', default='author_img/author-lg.jpg')
    biography = models.TextField(validators=[MinLengthValidator(50)])
    genres = models.ManyToManyField(Genre)
    language = models.CharField(max_length=50, default='English')
    origin = models.CharField(max_length=100, default='India')
    dob = models.CharField(max_length=30, null=True)
    website = models.CharField(max_length=50, null=True, blank=True)
    twitter = models.CharField(max_length=50, null=True, blank=True)
    num_reviews = models.IntegerField(default=0)
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(5)])
    total_followers = models.IntegerField(default=0)
    # top_book = models.CharField(max_length=80, null=True, blank=True)

    def __str__(self):
        return f"{self.name}"


class Series(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=80)
    image = models.ImageField(upload_to='series_img', default='/placeholder.png')
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(5)])
    num_reviews = models.IntegerField(default=0)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title


class Seller(models.Model):
    name = models.CharField(max_length=50)
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(5)])
    num_reviews = models.IntegerField(default=0)
    joined = models.DateField(auto_now_add=False)
    address = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class SellerBook(models.Model):
    seller = models.ForeignKey(Seller, on_delete=models.PROTECT)
    price = models.IntegerField(default=0)
    discount = models.IntegerField(default=0)
    count_in_stock = models.IntegerField(default=0)
    delivers_in = models.IntegerField(default=5)
    replacement = models.IntegerField(default=10)
    returnable = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.seller, self.price}'


class Book(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    series = models.ForeignKey(Series, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200)
    ISBN_10 = models.IntegerField(null=True)
    ISBN_13 = models.IntegerField(null=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='book_img', default='/placeholder.png')
    publisher = models.CharField(max_length=200, null=True)
    publication_date = models.TextField(null=True)
    orignal_price = models.IntegerField(
        validators=[MinValueValidator(10), MaxValueValidator(10000)])
    pages = models.IntegerField(default=0)
    genres = models.ManyToManyField(Genre)
    language = models.CharField(max_length=50, default='English')
    origin = models.CharField(max_length=30, default='IN')
    age_group = models.CharField(max_length=30, default='Any')
    weight = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    dimensions = models.CharField(max_length=25, null=True)
    description = models.TextField(validators=[MinLengthValidator(50)], null=True)
    bestseller_rank = models.IntegerField(null=True)
    sellerbook = models.OneToOneField(
        SellerBook, on_delete=models.PROTECT, null=True, default=None)
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(5)])
    num_reviews = models.IntegerField(default=0)
    sold = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} ({self.rating})"


class Format(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, null=True)
    format = models.CharField(max_length=30, default='Paperback')
    link = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.format

# <img src="{{ user.userprofile.avatar.url }}">
# <img src=path/to/images/{{ user.get_profile.avatar }}">


class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    avatar = models.ImageField(
        upload_to='profile_img', default='profile_img/user-avatar.jpg')
    mobile_no = models.IntegerField(
        validators=[MaxValueValidator(10000000000)], blank=True, null=True)
    gender = models.CharField(max_length=10, null=True)
    books = models.ManyToManyField(Book, related_name='favourites')
    authors = models.ManyToManyField(Author, related_name='followers')
    genres = models.ManyToManyField(Genre)
    wishlist = models.ManyToManyField(Book, related_name='wishlist')
    series = models.ManyToManyField(Series)

    def __str__(self):
        return self.user.first_name


class Cart(models.Model):
    user = models.ForeignKey(
        UserProfile, on_delete=models.SET_NULL, related_name='cart_items', null=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    format = models.OneToOneField(Format, on_delete=models.SET_NULL, null=True)
    seller = models.ForeignKey(Seller, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return str(self.book)


class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, null=True)
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, null=True)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=50)
    rating = models.IntegerField(default=0)
    title = models.TextField(null=True)
    comment = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.rating)


class Notification(models.Model):
    userprofile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name='notifications', null=True)
    title = models.CharField(max_length=50)
    body = models.TextField(null=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    is_unread = models.BooleanField(default=True)

    def __str__(self):
        return str(self.title)


class Address(models.Model):
    user = models.ForeignKey(
        UserProfile, related_name='addresses', on_delete=models.CASCADE)
    default = models.BooleanField(default=False)
    full_name = models.CharField(max_length=80)
    mobile_no = models.IntegerField(
        validators=[MaxValueValidator(10000000000)])
    pincode = models.CharField(max_length=10)
    building = models.CharField(max_length=50)
    area = models.CharField(max_length=50)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    landmark = models.CharField(max_length=50)
    address_type = models.CharField(max_length=30, null=True)

    def __str__(self):
        return f'{self.area}, {self.city}'


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    address = models.ForeignKey(Address, on_delete=models.PROTECT)
    payment_method = models.CharField(max_length=50)
    shipping_price = models.DecimalField(max_digits=7, decimal_places=2)
    total_price = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    total_savings = models.IntegerField(default=0)
    is_ordered = models.BooleanField(default=False, null=True)
    ordered_at = models.DateTimeField(auto_now_add=False, null=True)
    is_paid = models.BooleanField(default=False, null=True, blank=True)
    paid_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    is_dispatched = models.BooleanField(default=False, null=True)
    dispatched_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    is_shipped = models.BooleanField(default=False, null=True)
    shipped_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    is_delivered = models.BooleanField(default=False, null=True)
    delivered_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    arriving_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    is_cancelled = models.BooleanField(default=False, null=True)

    def __str__(self):
        return f'{self.address}, {self.ordered_at}'


class OrderItem(models.Model):
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=200)
    author_name = models.CharField(max_length=50, null=True)
    qty = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    discount = models.IntegerField(default=0)
    seller = models.CharField(max_length=50)
    image = models.CharField(max_length=200)

    def __str__(self):
        return str(self.title)
