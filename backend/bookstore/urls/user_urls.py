from django.urls import path
from bookstore.views import user_account_views as account
from bookstore.views import user_detail_views as detail


urlpatterns = [
    path('login/', account.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', account.register_user, name='register-user'),

    path('account/', account.get_user_account, name='get-user-account'),
    path('list/', account.get_user_list, name='get-user-list'),
    path('delete/<str:pk>/', account.delete_user, name='delete-user'),
    path('update/', account.update_user_account, name='user-account-update'),

    path('address/get/', account.get_address, name='get-address'),
    path('address/add/', account.add_address, name='add-address'),
    path('address/update/', account.update_address, name='update-address'),
    path('address/delete/<str:pk>/', account.delete_address, name='delete-address'),
    path('address/default/', account.default_address, name='change-default-address'),

    path('notifications/', account.get_unread_notifications, name='get-unread-notifications'),
    path('notifications/update/', account.update_read_notifications,
         name='update-read-notifications'),
    path('notifications/delete/<str:pk>/', account.delete_all_notifications,
         name='delete-notifications'),

    path('detail/', detail.get_user_detail, name='get-user-detail'),
    path('follow/author/', detail.follow_author, name='follow-author'),
    path('favourite/book/', detail.favourite_book, name='favourite-book'),
    path('favourite/genre/', detail.favourite_genre, name='favourite-genre'),
    path('favourite/genrelist/', detail.favourite_genrelist, name='favourite-genrelist'),
    path('favourite/series/', detail.favourite_series, name='favourite-series'),

    path('cart/', detail.get_cart_items, name='get-cart-item'),
    path('cart/add/', detail.add_cart_item, name='add-cart-item'),
    path('cart/remove/<str:pk>/', detail.remove_cart_item, name='remove-cart-item'),
    path('cart/clear/', detail.clear_cart_items, name='clear-cart-item'),

    path('wishlist/', detail.get_wishlist_items, name='get-wishlist-item'),
    path('wishlist/add/', detail.add_wishlist_item, name='add-wishlist-item'),
    path('wishlist/remove/<str:pk>/', detail.remove_wishlist_item, name='remove-wishlist-item'),
    path('wishlist/clear/', detail.clear_wishlist_items, name='clear-wishlist-item'),
]
