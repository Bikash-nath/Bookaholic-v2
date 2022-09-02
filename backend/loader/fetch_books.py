import requests
import json
import os
import random

__BASEURL = 'https://www.googleapis.com/books/v1/volumes'


def fetch_books(q, **kwargs):
    params = dict(q=q)
    for p in 'maxResults langRestrict printType filter download'.split():
        if p in kwargs:
            params[p] = kwargs[p]

    res = requests.get(__BASEURL, params=params)
    # with open('book1.txt', 'a') as f:
    #    f.write(res.content)

    # https://www.googleapis.com/books/v1/volumes?q=intitle%3AImmortals%2Cinauthor%3AAmish&maxResults=5

    if res.status_code == 200:
        return json.loads(res.content)
    else:
        print(res.status_code)
    return res


def filter_dict(r):
    d = {}
    try:
        d['title'] = r['volumeInfo']['title']
        try:
            d['ISBN_10'] = int(
                r['volumeInfo']['industryIdentifiers'][0]['identifier'])
        except:
            d['ISBN_10'] = 0
        try:
            d['ISBN_13'] = int(
                r['volumeInfo']['industryIdentifiers'][1]['identifier'])
        except:
            d['ISBN_13'] = 0
        d['author'] = r['volumeInfo']['authors'][0]
        d['image'] = 'book_images/' + r['volumeInfo']['title'] + '.jpg'
        d['orignal_price'] = random.randint(220, 700)
        d['discount'] = randint(20, 50)
            d['price'] = d['price'] - (d['discount'] * d['price']) / 100
        if r['volumeInfo']['language'] == 'en':
            d['language'] = 'English'
        else:
            d['language'] = r['volumeInfo']['language']
        d['publisher'] = r['volumeInfo'].get('publisher')
        d['publication_date'] = r['volumeInfo']['publishedDate']
        if r['volumeInfo']["maturityRating"] == "NOT_MATURE":
            d['age_group'] = '10+'
        else:
            d['age_group'] = '18+'
        d['pages'] = r['volumeInfo'].get('pageCount') or 300
        d['genres'] = r['volumeInfo']['categories']

        d['formats'] = {}
        if r.get('accessInfo') and r['accessInfo']['epub'].get('acsTokenLink'):
            d['formats']['Ebook'] = r['accessInfo']['epub']['acsTokenLink']
        if r.get('accessInfo') and r['accessInfo']['pdf'].get('acsTokenLink'):
            d['formats']['PDF'] = r['accessInfo']['pdf']['acsTokenLink']

        d['origin'] = r['saleInfo']['country']
        d['dimensions'] = r['volumeInfo'].get('dimensions')
        d['description'] = r['volumeInfo'].get('description')
        d['rating'] = r['volumeInfo'].get('averageRating') or 0.00
        d['num_reviews'] = r['volumeInfo'].get('ratingsCount') or 0

        path = os.path.join(os.path.join(
            os.getcwd() + '/uploads/book_images/' + r['volumeInfo']['title'] + '.jpg'))
        if not os.path.exists(path):
            image = requests.get(
                f"http://covers.openlibrary.org/b/isbn/{d.get('ISBN_10')}.jpg?default=false")
            if not image.ok:
                image = requests.get(
                    f"http://covers.openlibrary.org/b/isbn/{d.get('ISBN_13')}.jpg?default=false")
            if not image.ok:
                url = r['volumeInfo'].get('imageLinks')
                if not url:
                    return {}
            if not image.ok and url.get('large'):
                image = requests.get(url.get('large'))
            if not image.ok and url.get('medium'):
                image = requests.get(url.get('medium'))
            if not image.ok and url.get('small'):
                image = requests.get(url.get('small'))
            if not image.ok:
                image = requests.get(url['thumbnail'])
            with open(path, 'wb') as f:
                f.write(image.content)
        return d
    except Exception as e:
        print('🇽 Exception-', e)
        return {}


def author_books(author):
    print(author)
    results = []
    res = fetch_books(f'author:{author}', maxResults=12)

    if not res.get('items'):
        print(res)

    for r in res['items']:
        d = filter_dict(r)
        if d != {} or d != None:
            results.append(d)
    return results

# use subject(keyword) & printType(parameter) for gemres


def isbn_books():
    isbn_list = [9780807286005, 9780807286005, 9780439064873, 9780807283158,
                 9780439139595, 9781855496484, 9780307283641, 9780739360385, ]
    results = []
    invalid_isbn = []
    for i, isbn in enumerate(isbn_list):
        res = fetch_books(f'isbn:{isbn}', maxResults=1)

        if not res.get('items'):
            invalid_isbn.append(isbn)
            continue
        d = filter_dict(res['items'][0])
        if d != {} or d != None:
            results.append(d)
            print(d.get('title'), 'found.')
    if len(invalid_isbn):
        print('Invalid ISBN list-\n', invalid_isbn)
    print(f'{len(results)} books data fetched.. Invalid ISBNs- {len(invalid_isbn)}')
    return results


def title_books():
    title_list = ["Harry Potter and the Sorcerer's Stone",
                  "Harry Potter and the Chamber of Secrets",
                  "Harry Potter and the Prisoner of Azkaban",
                  "Harry Potter and the Goblet of Fire",
                  "Harry Potter and the Order of the Phoenix",
                  "Harry Potter and the Half-Blood Prince",
                  "Harry Potter and the Deathly Hallows"]
    results = []
    invalid_title = []
    for i, title in enumerate(title_list):
        res = fetch_books(f'intitle:{title}', maxResults=1)

        try:
            if input(res['items'][0]['volumeInfo']['title'] + ' fetched. Do u want to continue❓ (y/n): ') != 'y':
                continue
        except Exception as e:
            print('🇽 Title Exception-', e)
            invalid_title.append(title)
            continue

        d = filter_dict(res['items'][0])
        if d != {} or d != None:
            results.append(d)
    if len(invalid_title):
        print('Invalid title list-\n', invalid_title)
    return results
