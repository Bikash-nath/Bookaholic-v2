from django.contrib import admin
from .models import Book, Author, Series, Genre, Format, Review, Order, OrderItem, Address, UserProfile, Seller, SellerBook


class BookAdmin(admin.ModelAdmin):
   list_filter = ('author', 'genres', 'publisher',
                  'publication_date', 'bestseller_rank', 'rating')
   list_display = ('title', 'author', 'rating') # Display Book-Price


class AuthorAdmin(admin.ModelAdmin):
   list_filter = ('rating', 'genres', 'origin', )
   list_display = ('name', 'origin', 'rating')


class SeriesAdmin(admin.ModelAdmin):
   list_filter = ('title', 'rating')
   list_display = ('title', 'rating')


admin.site.register(Book, BookAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Series, SeriesAdmin)
admin.site.register(Genre)
admin.site.register(Format)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Address)
admin.site.register(UserProfile)
admin.site.register(Seller)
admin.site.register(SellerBook)
