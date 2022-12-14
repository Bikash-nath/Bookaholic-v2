# Generated by Django 2.2.12 on 2021-09-21 07:49

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('default', models.BooleanField(default=False)),
                ('full_name', models.CharField(max_length=80)),
                ('mobile_no', models.IntegerField(validators=[django.core.validators.MaxValueValidator(10000000000)])),
                ('pincode', models.CharField(max_length=10)),
                ('building', models.CharField(max_length=50)),
                ('area', models.CharField(max_length=50)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=50)),
                ('landmark', models.CharField(max_length=50)),
                ('address_type', models.CharField(max_length=30, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('image', models.ImageField(default='/author-image.jpg', upload_to='author_images')),
                ('biography', models.TextField(validators=[django.core.validators.MinLengthValidator(50)])),
                ('language', models.CharField(default='English', max_length=50)),
                ('origin', models.CharField(default='India', max_length=100)),
                ('dob', models.CharField(max_length=30, null=True)),
                ('website', models.CharField(blank=True, max_length=50, null=True)),
                ('twitter', models.CharField(blank=True, max_length=50, null=True)),
                ('num_reviews', models.IntegerField(default=0)),
                ('rating', models.DecimalField(decimal_places=1, max_digits=2, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)])),
                ('total_followers', models.IntegerField(default=0)),
                ('top_book', models.CharField(blank=True, max_length=80, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('ISBN_10', models.IntegerField(null=True)),
                ('ISBN_13', models.IntegerField(null=True)),
                ('image', models.ImageField(default='/placeholder.png', upload_to='book_images')),
                ('price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('discount', models.IntegerField(default=0)),
                ('language', models.CharField(default='English', max_length=50)),
                ('publisher', models.CharField(max_length=200, null=True)),
                ('publication_date', models.TextField(null=True)),
                ('pages', models.IntegerField(default=0)),
                ('origin', models.CharField(default='IN', max_length=30)),
                ('age_group', models.CharField(default='Any', max_length=30)),
                ('weight', models.DecimalField(decimal_places=2, default=0.0, max_digits=6)),
                ('dimensions', models.CharField(max_length=25, null=True)),
                ('description', models.TextField(null=True, validators=[django.core.validators.MinLengthValidator(50)])),
                ('bestseller_rank', models.IntegerField(null=True)),
                ('rating', models.DecimalField(decimal_places=1, max_digits=2, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)])),
                ('num_reviews', models.IntegerField(default=0)),
                ('count_in_stock', models.IntegerField(default=0)),
                ('sold', models.IntegerField(default=0)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bookstore.Author')),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('genre', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_method', models.CharField(max_length=50)),
                ('shipping_price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('total_price', models.DecimalField(decimal_places=2, default=0.0, max_digits=7)),
                ('total_savings', models.IntegerField(default=0)),
                ('ordered_at', models.DateTimeField(auto_now_add=True)),
                ('is_paid', models.BooleanField(blank=True, default=False, null=True)),
                ('paid_at', models.DateTimeField(blank=True, null=True)),
                ('is_dispatched', models.BooleanField(default=False, null=True)),
                ('dispatched_at', models.DateTimeField(blank=True, null=True)),
                ('is_shipped', models.BooleanField(default=False, null=True)),
                ('shipped_at', models.DateTimeField(blank=True, null=True)),
                ('is_delivered', models.BooleanField(default=False, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('arriving_at', models.DateTimeField(blank=True, null=True)),
                ('is_cancelled', models.BooleanField(default=False, null=True)),
                ('address', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bookstore.Address')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Seller',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('delivers_in', models.IntegerField(default=5)),
                ('replacement', models.IntegerField(default=10)),
                ('returnable', models.BooleanField(default=False)),
                ('rating', models.DecimalField(decimal_places=1, max_digits=2, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)])),
                ('num_reviews', models.IntegerField(default=0)),
                ('joined', models.DateField()),
                ('address', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Series',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=80)),
                ('rating', models.DecimalField(decimal_places=1, max_digits=2, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)])),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('avatar', models.ImageField(default='profile_images/user-avatar.jpg', upload_to='profile_images')),
                ('mobile_no', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MaxValueValidator(10000000000)])),
                ('gender', models.CharField(max_length=10, null=True)),
                ('authors', models.ManyToManyField(related_name='followers', to='bookstore.Author')),
                ('books', models.ManyToManyField(related_name='favourites', to='bookstore.Book')),
                ('genres', models.ManyToManyField(to='bookstore.Genre')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('wishlist', models.ManyToManyField(related_name='wishlist', to='bookstore.Book')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('rating', models.IntegerField(default=0)),
                ('title', models.TextField(null=True)),
                ('comment', models.TextField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bookstore.Author')),
                ('book', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bookstore.Book')),
                ('seller', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bookstore.Seller')),
                ('series', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bookstore.Series')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('author_name', models.CharField(max_length=50, null=True)),
                ('qty', models.IntegerField(default=0)),
                ('price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('discount', models.IntegerField(default=0)),
                ('seller', models.CharField(max_length=50)),
                ('image', models.CharField(max_length=200)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bookstore.Author')),
                ('book', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bookstore.Book')),
                ('order', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bookstore.Order')),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('body', models.TextField(null=True)),
                ('generated_at', models.DateTimeField(auto_now_add=True)),
                ('is_unread', models.BooleanField(default=True)),
                ('userprofile', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='bookstore.UserProfile')),
            ],
        ),
        migrations.CreateModel(
            name='Format',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('format', models.CharField(default='Paperback', max_length=30)),
                ('link', models.CharField(blank=True, max_length=200, null=True)),
                ('book', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bookstore.Book')),
            ],
        ),
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bookstore.Book')),
                ('format', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bookstore.Format')),
                ('seller', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bookstore.Seller')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cart_items', to='bookstore.UserProfile')),
            ],
        ),
        migrations.AddField(
            model_name='book',
            name='genres',
            field=models.ManyToManyField(to='bookstore.Genre'),
        ),
        migrations.AddField(
            model_name='book',
            name='seller',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bookstore.Seller'),
        ),
        migrations.AddField(
            model_name='book',
            name='series',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bookstore.Series'),
        ),
        migrations.AddField(
            model_name='book',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='author',
            name='genres',
            field=models.ManyToManyField(to='bookstore.Genre'),
        ),
        migrations.AddField(
            model_name='address',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='addresses', to='bookstore.UserProfile'),
        ),
    ]
