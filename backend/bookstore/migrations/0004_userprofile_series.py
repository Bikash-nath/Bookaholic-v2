# Generated by Django 2.2.12 on 2021-09-24 05:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0003_auto_20210923_1738'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='series',
            field=models.ManyToManyField(related_name='series', to='bookstore.Series'),
        ),
    ]
