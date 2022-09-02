import os
from bookstore.models import Author

for a in Author.objects.all():
    path_sm = os.path.join(os.path.join(os.getcwd() + '/uploads/' + str(a.image_sm)))
    path_lg = os.path.join(os.path.join(os.getcwd() + '/uploads/' + str(a.image_lg)))
    if not os.path.exists(path_sm):
        a.image_sm = str(a.image_sm).split('-sm.jpg')[0] + '.jpg'
    if not os.path.exists(path_lg):
        a.image_lg = str(a.image_lg).split('-lg.jpg')[0] + '.jpg'
    a.save()
