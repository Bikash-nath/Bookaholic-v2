import requests
import os
from bs4 import BeautifulSoup


def create_series(soup):
    try:
        series_list = []
        for series in soup.find_all('div', class_="seriesBookRow"):
            d = {}
            seriesDesc = series.find('div', class_='seriesDesc')
            d['title'] = seriesDesc.a.text
            d['rating'] = float(seriesDesc.find(
                'span', class_='minirating').text.split('avg')[0].strip())
            d['books'] = []
            for s in series.find('div', class_='seriesCovers').find_all('a'):
                d['books'].append(s['title'])

            d['author'] = soup.find('div', class_="rightContainer").find(
                'h1', class_='authorName').text.replace('\n', '')

            series_page = requests.get('https://www.goodreads.com' +
                                       series.find('div', class_='seriesDesc').a['href'])
            series_soup = BeautifulSoup(series_page.text, 'lxml')
            d['description'] = series_soup.find('div', class_="expandableHtml").span.text

            series_list.append(d)
        return series_list

    except Exception as e:
        print('🇽 Series_list:-', e)
        return None


def series():
    all_series = []  # list of series_list
    for i in range(1):
        try:
            path = os.path.join(os.path.join(
                os.getcwd() + f'/loader/author_data/{i+1}.html'))
            with open(path, 'r') as f:
                html = f.read()
                soup = BeautifulSoup(html, 'lxml')
                series = create_series(soup)
                if series != None:
                    all_series.append(series)
        except Exception as e:
            print('🇽 All Series:-', e)
            continue

    return all_series
