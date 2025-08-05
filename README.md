# Unforgiving Minute Distance Running

A professional distance running training application with scientifically-based GoldenPace calculations using Jack Daniels' Running Formula.

## Features

### GoldenPace Calculator

The app includes a comprehensive GoldenPace (Velocity at VO2max) calculator based on Jack Daniels' Running Formula. Enter your recent race time and distance to get your current GoldenPace and corresponding training paces.

### Sample Calculations

**GoldenPace 60 (17:03 5K)**
- Easy: 7:00-8:00 per mile
- Marathon: 5:30 per mile  
- Threshold: 5:00 per mile
- Interval: 4:30 per mile
- Repetition: 4:30 per mile

**GoldenPace 50 (19:57 5K)**
- Easy: 8:00-9:00 per mile
- Marathon: 6:30 per mile
- Threshold: 6:00 per mile
- Interval: 5:30 per mile
- Repetition: 5:10 per mile

**GoldenPace 40 (24:08 5K)**
- Easy: 9:00-10:00 per mile
- Marathon: 7:50 per mile
- Threshold: 7:20 per mile
- Interval: 6:50 per mile
- Repetition: 6:30 per mile

### Supported Distances
- 5K, 10K, 15K, Half Marathon, Marathon
- All times converted to equivalent 5K using Riegel formula
- Accurate GoldenPace lookup based on official Daniels Running Formula tables
- Interpolation for precise values between reference points

### Training Plans
- **Structured Programs**: Tailored to your GoldenPace fitness level
- **Multiple Distances**: 5K, 10K, Half Marathon, Marathon plans
- **Progressive Training**: Build fitness systematically
- **Download Options**: Save plans for offline use

### User Profiles
- **Personalized Experience**: Save your preferences and history
- **Progress Tracking**: Monitor your GoldenPace improvements
- **Training History**: Review past calculations and plans

## Technology Stack

### Frontend
- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Responsive Design**: Works on all devices

### Backend (Django)
- **Django 4.2**: Robust web framework
- **Django REST Framework**: API development
- **PostgreSQL/SQLite**: Database support
- **Celery**: Background task processing

## Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Backend Setup
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

## GoldenPace Range
- **Full Range**: 30-75 GoldenPace values
- **Interpolation**: Precise calculations between reference points
- **Validation**: Input validation and error handling
- **Accuracy**: Based on official Daniels Running Formula book

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Jack Daniels, PhD**: For the Daniels Running Formula methodology
- **Daniels' Running Formula**: The authoritative source for GoldenPace calculations
- **Running Community**: For feedback and testing

---

*Unforgiving Minute Distance Running - Where every minute counts in your training journey.* 