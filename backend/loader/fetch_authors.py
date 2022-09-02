import requests
import os
from bs4 import BeautifulSoup


def create_author(soup):
    try:
        d = {}
        leftContainer = soup.find('div', class_="authorLeftContainer")
        author_id = soup.find('link')['href'].split('/')[5].split('.')[0]

        ratings = soup.find('div', class_="hreview-aggregate")
        d['rating'] = float(ratings.find('span', class_='average').text)

        followers = 0
        follow_container = soup.find_all(
            'div', class_="h2Container gradientHeaderContainer")
        for i in range(len(follow_container)):
            try:
                followers = int(follow_container[i].h2.a.text.split(
                    '(')[1].split(')')[0].replace(',', ''))
                break
            except:
                continue
        d['total_followers'] = followers

        data = soup.find('div', class_="rightContainer")
        d['name'] = data.find(
            'h1', class_='authorName').text.replace('\n', '')

        details = list(s.strip() for s in str(data.text).split('\n')[:20])
        if 'Born' in details:
            d['origin'] = details[details.index('Born') + 1]
        else:
            d['origin'] = None

        titles = data.find_all('div', class_='dataTitle')
        values = data.find_all('div', class_='dataItem')
        zipped = zip(titles, values) if len(titles) == len(
            values) else zip(titles[1:], values)
        for x in tuple(zipped):
            if x[0].text in ['Born', 'Website', 'Twitter']:
                d[x[0].text] = x[1].text.strip()
            elif x[0].text == 'Genre':
                d['genres'] = list(genre.strip()
                                   for genre in x[1].text.split(','))

        d['top_book'] = soup.find('title').text.split('of ')[
            1].replace(')', '')
        d['language'] = 'English'
        print()
        try:
            d['biography'] = soup.find('span', id=f'freeTextauthor{author_id}').text
        except:
            d['biography'] = soup.find('span', id=f'freeTextContainerauthor{author_id}').text

        img_sm_url = leftContainer.img['src']
        if img_sm_url == 'https://s.gr-assets.com/assets/nophoto/user/u_200x266-e183445fd1a1b5cc7075bb1cf7043306.png':
            d['image_sm'] = '/uploads/author_images/author-sm'
            d['image_lg'] = '/uploads/author_images/author-lg'
        else:
            path_sm = os.path.join(os.path.join(
                os.getcwd() + '/uploads/author_images/' + d['name'] + '-sm' + '.jpg'))
            if not os.path.exists(path_sm):
                img_sm = requests.get(img_sm_url)
                with open(path_sm, 'wb') as f:
                    f.write(img_sm.content)
            d['image_sm'] = '/uploads/author_images/' + d['name'] + '-sm' + '.jpg'

            path_lg = os.path.join(os.path.join(
                os.getcwd() + '/uploads/author_images/' + d['name'] + '-lg' + '.jpg'))
            if os.stat(path_sm).st_size == 0:
                img_page = requests.get('https://www.goodreads.com' + leftContainer.a['href'])

                img_soup = BeautifulSoup(img_page.text, 'lxml')
                img_lg_url = img_soup.find('div', class_='leftContainer').div.img['src']
                img_lg = requests.get(img_lg_url)
                with open(path_lg, 'wb') as f:
                    f.write(img_lg.content)
            d['image_lg'] = '/uploads/author_images/' + d['name'] + '-lg' + '.jpg'

        return d

    except Exception as e:
        print('🇽 Author err:-', e)
        return None


def authors():
    authors_data = []
    for i in range(4):
        try:
            path = os.path.join(os.path.join(
                os.getcwd() + f'/loader/author_data/{i+1}.html'))
            with open(path, 'r') as f:
                html = f.read()
                soup = BeautifulSoup(html, 'lxml')
                author = create_author(soup)
                if author != None:
                    authors_data.append(author)
                print(author['name'], 'fetched.')
        except Exception as e:
            print('🇽 Authors err:-', e)
            continue

    return authors_data


# path = os.path.join(os.path.join(
    #     os.getcwd() + f'/loader/author_data/0.html'))
    # with open(path, 'r') as f:
    #    img_page = f.read()
    # f.close()
