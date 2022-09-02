from bookstore.models import Book, Genre, Review
from django.shortcuts import render


def about(request):    
    return render(request, "bookstore/about.html")

def terms_and_conditions(request):    
    return render(request, "bookstore/terms&conditions.html")


def privacy(request):    
    return render(request, "bookstore/privacy.html")


def contact(request):    
    return render(request, "bookstore/contact.html")


def faq(request):    
    return render(request, "bookstore/faq.html")

