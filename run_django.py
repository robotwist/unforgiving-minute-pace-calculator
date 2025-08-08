#!/usr/bin/env python3
import os
import sys
import django

# Add the project directory to the Python path
sys.path.insert(0, '/home/robwistrand/code/solo/running/unforgiving-minute')

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'runpace_pro.settings')

# Setup Django
django.setup()

if __name__ == '__main__':
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'runserver', '8001'])
