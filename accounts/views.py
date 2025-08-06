from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import User, UserProfile
from .serializers import UserProfileSerializer

# Add your account-related views here 

@api_view(['POST'])
@permission_classes([AllowAny])
def create_profile(request):
    """Create a new user profile"""
    try:
        data = request.data
        # Create user first
        user = User.objects.create_user(
            username=data.get('email'),
            email=data.get('email'),
            first_name=data.get('name', ''),
            experience_level=data.get('experience', 'beginner')
        )
        
        # Create user profile
        profile = UserProfile.objects.create(
            user=user,
            current_vdot=data.get('current_vdot'),
            weekly_mileage=data.get('weekly_mileage'),
            goal_race_distance=data.get('goal_race_distance'),
            goal_race_time=data.get('goal_race_time'),
            injury_history=data.get('injury_history', '')
        )
        
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def profile_detail(request, email):
    """Get or update user profile by email"""
    try:
        user = User.objects.get(email=email)
        profile = UserProfile.objects.get(user=user)
        
        if request.method == 'GET':
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            data = request.data
            # Update user info
            if 'name' in data:
                user.first_name = data['name']
            if 'experience' in data:
                user.experience_level = data['experience']
            user.save()
            
            # Update profile info
            serializer = UserProfileSerializer(profile, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) 