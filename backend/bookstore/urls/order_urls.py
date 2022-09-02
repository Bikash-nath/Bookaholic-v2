from django.urls import path
from bookstore.views import order_views as views


urlpatterns = [
    path('add/', views.add_order_items, name='add-order'),
    path('myorders/', views.get_orders, name='user-orders'),
    path('cancel/<str:pk>/', views.cancel_order, name='cancel-order'),
    path('cancelitem/<str:pk>/', views.cancel_order_item, name='cancel-order-item'),
    path('<str:pk>/', views.get_order_by_id, name='user-order-details'),
    path('<str:pk>/pay/', views.update_order_to_paid, name='pay'),
]
