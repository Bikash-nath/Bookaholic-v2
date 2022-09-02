import requests
import os
from bs4 import BeautifulSoup

for i in range(4):
    path = os.path.join(os.path.join(
        os.getcwd() + f'/author_data/{i+1}.html'))
    with open(path, 'r') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'lxml')

    data = soup.find('div', class_="rightContainer")

    details = list(s.strip() for s in str(data.text).split('\n')[:20])
    print(details)
    # if 'Born' in details:
    #    origin=details[details.index('Born')+1]
    # print(origin)
