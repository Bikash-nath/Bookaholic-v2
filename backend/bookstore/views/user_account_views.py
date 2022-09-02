from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
# from passlib.handlers.django import sha56

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User
from bookstore.models import UserProfile, Author, Book, Series, Genre, Notification, Cart, Address, Seller
from bookstore.serializers.user_serializer import UserAccountSerializer, CartSerializer, BookSerializer, NotificationSerializer
from bookstore.serializers.order_serializer import AddressSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserAccountSerializer(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['firstName'],
            last_name=data['lastName'],
            username=data['email'].split('@')[0],
            email=data['email'],
            password=make_password(data['password'])
        )
        userserializer = UserAccountSerializer(user, many=False)
        return Response(userserializer.data)
    except:
        message = {'error_message': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def get_user_account(request):
    user = request.user
    serializer = UserAccountSerializer(user, many=False)
    return Response(serializer.data)


@ api_view(['GET'])
@ permission_classes([IsAdminUser])
def get_user_list(request):
    users = User.objects.all()
    serializer = UserAccountSerializer(users, many=True)
    return Response(serializer.data)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def update_user_account(request):
    try:
        user = request.user
        data = request.data
        print('👱 DATA', data)
        if not check_password(data['confirmPassword'], user.password):
            raise Exception('Password did not match')

        userprofile = user.userprofile_set.all()[0]
        # userprofile = UserProfile.objects.get(id=data['profile_id'])

        if request.FILES.get('avatar'):
            userprofile.avatar = request.FILES['avatar']
        if data.get('mobileNo'):
            userprofile.mobile_no = data['mobileNo']
        if data.get('gender'):
            userprofile.gender = data['gender']
        userprofile.save()

        if data.get('firstName'):
            user.first_name = data['firstName']
        if data.get('lastName'):
            user.last_name = data['lastName']
        if data.get('email'):
            user.email = data['email']
            # update password if password is provided or else don't update
        if data.get('newPassword'):
            user.password = make_password(data['newPassword'])
        user.save()

        Notification.objects.create(userprofile=userprofile, title='👤 Account details updated',
                                    body='You have successfully updated your account details.')
        serializer = UserAccountSerializer(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        print('❌ Exception-', e)
        message = {'error_message': 'Current Password is incorrect.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['DELETE'])
@ permission_classes([IsAdminUser])
def delete_user(request, pk):
    user = User.objects.get(id=pk)
    name = str(user)
    user.delete()
    return Response({'message': f'{name.capitalize()} was successfully deleted.'}, status=status.HTTP_204_NO_CONTENT)


@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def get_address(request):
    addresses = Address.objects.all()
    serializer = AddressSerializer(addresses, many=True)
    return Response(serializer.data)


@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def add_address(request):
    try:
        userprofile = request.user.userprofile_set.all()[0]
        address = Address.objects.create(
            user=userprofile,
            full_name=request.data['fullName'],
            mobile_no=request.data['mobileNo'],
            pincode=request.data['pincode'],
            building=request.data['building'],
            area=request.data['area'],
            landmark=request.data['landmark'],
            city=request.data['city'],
            state=request.data['state'],
            address_type=request.data.get('addressType')
        )
        serializer = AddressSerializer(address, many=False)
        return Response(serializer.data)
    except Exception as e:
        print("Exception--", e)
        return Response({'message': 'Invalid  Address'}, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def update_address(request):
    try:
        userprofile = request.user.userprofile_set.all()[0]
        address = Address.objects.get(id=request.data['addressId'])
        print('⭐ Address found:-', address)
        address.full_name = request.data['fullName'],
        address.mobile_no = request.data['mobileNo'],
        address.pincode = request.data['pincode'],
        address.building = request.data['building'],
        address.area = request.data['area'],
        address.landmark = request.data['landmark'],
        address.city = request.data['city'],
        address.state = request.data['state'],
        if request.data.get('addressType'):
            address.address_type = request.data['addressType']
        address.save()
        serializer = AddressSerializer(address, many=False)
        return Response(serializer.data)
    except Exception as e:
        print("Err", e)
        return Response({'message': 'Invalid  Address'}, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['DELETE'])
@ permission_classes([IsAuthenticated])
def delete_address(request, pk):
    try:
        address = Address.objects.get(id=pk)
        address.delete()
        return Response({'address_id': pk})
    except Exception as e:
        print('🔽-', e)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def default_address(request):
    try:
        address = Address.objects.filter(default=True)
        if len(address):
            address[0].default = False
            address[0].save()
        address = Address.objects.get(id=request.data['addressId'])
        address.default = True
        address.save()
        return Response({'address_id': address.id})
    except Exception as e:
        print('🔽-', e)


@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def get_unread_notifications(request):
    userprofile = request.user.userprofile_set.all()[0]
    unread = userprofile.notifications.filter(is_unread=True)
    serializer = NotificationSerializer(unread, many=True)
    # print("Notifications:", serializer.data)
    return Response({'unread': serializer.data}, status=status.HTTP_200_OK)


@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def update_read_notifications(request,pk):
    userprofile = request.user.userprofile_set.all()[0]
    userprofile.notifications.get(id=pk).delete()
    return Response({'notification_id': pk}, status=status.HTTP_200_OK)

@ api_view(['PUT'])
@ permission_classes([IsAuthenticated])
def delete_all_notifications(request):
    userprofile = request.user.userprofile_set.all()[0]
    userprofile.notifications.all().delete()
    return Response(status=status.HTTP_202_ACCEPTED)