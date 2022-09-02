from rest_framework import serializers
from bookstore.models import Address, OrderItem, Order
from .user_serializer import UserProfileSerializer


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField(read_only=True)
    address = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_order_items(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_address(self, obj):
        try:
            # query from database
            address = AddressSerializer(
                obj.address, many=False).data
        except Exception as e:
            address = False
        return address

    def get_user(self, obj):
        serializer = UserProfileSerializer(obj.user, many=False)
        return serializer.data
