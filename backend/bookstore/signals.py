from django.db.models.signals import post_save
from django.contrib.auth.models import User
from bookstore.models import UserProfile, Notification


def createUserProfile(sender, instance, **kwargs):
    user = instance
    if len(user.userprofile_set.all()) == 0:
        userprofile = UserProfile.objects.create(
            user=user, avatar='/profile_images/user-avatar.jpg', mobile_no=None)

        Notification.objects.create(userprofile=userprofile, title='🎉 Welcome to Bookaholic',
                                    body='You have successfully created your Bookaholic account. Discover, Buy and Read your favourite collection of books.')


post_save.connect(createUserProfile, sender=User)
