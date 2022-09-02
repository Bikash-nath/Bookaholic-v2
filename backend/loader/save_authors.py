import requests
from bs4 import BeautifulSoup

# res = requests.get('https://www.goodreads.com/author/on_goodreads')
# with open('author_data/authors.html', 'a') as f:
#    f.write(res.text)
# soup = BeautifulSoup(res.text, 'lxml')

with open('author_data/authors.html', 'r') as f:
    res = f.read()
soup = BeautifulSoup(res, 'lxml')

f.close()

links = []

for data in soup.find_all('div', class_="elementList"):
    link = 'https://www.goodreads.com' + data.a['href']
    links.append(link)

for i in range(len(links)):
    res = requests.get(links[i])

    with open(f"author_data/{i+1}.html", 'w') as f:
        f.write(res.text)

    print(links[i].split('.')[3], 'saved')

f.close()
