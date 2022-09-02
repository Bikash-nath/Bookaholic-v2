import requests
from bs4 import BeautifulSoup

links = ['https://www.goodreads.com/series/43790-a-song-of-ice-and-fire'
         ]
# 'https://www.goodreads.com/author/show/1077326.J_K_Rowling',
# 'https://www.goodreads.com/author/show/61124.Chetan_Bhagat',

for i in range(len(links)):
    res = requests.get(links[i])

    print(res.status_code)

    with open(f"author_data/{i+11}.html", 'w') as f:
        f.write(res.text)
    f.close()

    print(links[i].split('.')[3], 'saved')
