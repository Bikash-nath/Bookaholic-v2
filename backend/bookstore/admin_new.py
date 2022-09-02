from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Book, Author, Series, Genre, Format, Review, Order, OrderItem, Address, UserProfile, Seller


class UserAdmin(UserAdmin):
    list_display = ('name', 'email', 'mobile_no', 'is_admin', 'is_staff')
    search_fields = ('email', 'name', 'mobile_no')
    list_filter = ('is_admin', 'is_staff', 'last_login')
    readonly_field = ('id', 'date_joined', 'last_login')

    filter_horizontal = ()
    fieldsets = ()


class BookAdmin(admin.ModelAdmin):
    list_filter = ('author', 'genres', 'price', 'publisher',
                   'publication_date', 'bestseller_rank', 'rating')
    list_display = ('title', 'author', 'price', 'rating')


class AuthorAdmin(admin.ModelAdmin):
    list_filter = ('rating', 'genres', 'origin', )
    list_display = ('name', 'origin', 'rating')


class SeriesAdmin(admin.ModelAdmin):
    list_filter = ('title', 'rating')
    list_display = ('title', 'rating')


admin.site.register(User, UserAdmin)
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
