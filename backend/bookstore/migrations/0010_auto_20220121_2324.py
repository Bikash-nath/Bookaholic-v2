# Generated by Django 2.2.12 on 2022-01-21 17:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0009_auto_20211230_0839'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='discount',
        ),
        migrations.RemoveField(
            model_name='book',
            name='orignal_price',
        ),
        migrations.RemoveField(
            model_name='book',
            name='price',
        ),
        migrations.RemoveField(
            model_name='book',
            name='seller',
        ),
        migrations.RemoveField(
            model_name='seller',
            name='delivers_in',
        ),
        migrations.RemoveField(
            model_name='seller',
            name='replacement',
        ),
        migrations.RemoveField(
            model_name='seller',
            name='returnable',
        ),
        migrations.AlterField(
            model_name='author',
            name='image_lg',
            field=models.ImageField(default='author_img/author-lg.jpg', upload_to='author_img'),
        ),
        migrations.AlterField(
            model_name='author',
            name='image_sm',
            field=models.ImageField(default='author_img/author-sm.jpg', upload_to='author_img'),
        ),
        migrations.AlterField(
            model_name='book',
            name='image',
            field=models.ImageField(default='/placeholder.png', upload_to='book_img'),
        ),
        migrations.AlterField(
            model_name='series',
            name='image',
            field=models.ImageField(default='/placeholder.png', upload_to='series_img'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='avatar',
            field=models.ImageField(default='profile_img/user-avatar.jpg', upload_to='profile_img'),
        ),
        migrations.CreateModel(
            name='SellerBook',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('orignal_price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('discount', models.IntegerField(default=0)),
                ('price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('delivers_in', models.IntegerField(default=5)),
                ('replacement', models.IntegerField(default=10)),
                ('returnable', models.BooleanField(default=False)),
                ('seller', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bookstore.Seller')),
            ],
        ),
        migrations.AddField(
            model_name='book',
            name='sellerbook',
            field=models.OneToOneField(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='bookstore.SellerBook'),
        ),
    ]
