# Generated by Django 4.0.5 on 2022-07-18 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0022_alter_book_orignal_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sellerbook',
            name='price',
            field=models.IntegerField(default=0),
        ),
    ]
