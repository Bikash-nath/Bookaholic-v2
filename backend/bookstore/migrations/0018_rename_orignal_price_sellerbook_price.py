# Generated by Django 4.0.5 on 2022-06-19 06:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0017_rename_price_sellerbook_orignal_price'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sellerbook',
            old_name='orignal_price',
            new_name='price',
        ),
    ]