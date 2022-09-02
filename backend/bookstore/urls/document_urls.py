from django.urls import path
from bookstore.views import document_views as views

urlpatterns = [    
    path('about/', views.about, name='about'),    
    path('t&c/', views.terms_and_conditions, name='terms-and-conditions'),    
    path('privacy/', views.privacy, name='privacy'),    
    path('contact/', views.contact, name='contact'),    
    path('faq/', views.faq, name='faq'),    
]
