# TigerTrekkr 🐤

TigerTrekkr is a campus exploration and location-guessing game inspired by GeoGuessr. Players explore 360° panoramic images of the University of Missouri campus and use an interactive map to guess where each location is.

Players can choose a difficulty level that changes the amount of camera movement available during a round. After submitting a guess, the game calculates the distance between the player's guess and the actual location and awards points based on the accuracy of the guess.

## Features

- 🗺️ Interactive guessing map
- 🌎 360° panoramic campus imagery
- 🎮 Three difficulty levels
- 📍 Location-based scoring
- 🔐 User login and signup
- 👤 Guest gameplay
- 🏆 Leaderboard
- ⚙️ Settings
- ❓ Help and FAQ
- 📊 End-of-game results
- 🖼️ Interactive panorama controls
- 📱 Responsive game interface

## Difficulty Levels

TigerTrekkr has three difficulty levels that affect the player's ability to look around the 360° image.

| Difficulty | Camera Movement |
|------------|-----------------|
| Easy | Full 360° rotation and zoom |
| Medium | 180° rotation and zoom |
| Hard | Zoom only; no rotation |

The difficulty level is selected before starting a game and remains active throughout the round.

## How to Play

1. Open TigerTrekkr.
2. Log in, sign up, or continue as a guest.
3. Select a difficulty level.
4. Explore the 360° campus image panorama.
5. Use the mini map to determine where you think the image was taken.
6. Place your guess on the map.
7. Submit your guess.
8. View the actual location and your score.
9. Play again!

## Scoring

TigerTrekkr uses the **Haversine formula** to calculate the geographic distance between the player's guess and the correct location.

The closer the player's guess is to the actual location, the more points they receive.

The basic distance calculation uses the latitude and longitude of both locations:

```text
a = sin²(Δlat / 2)
    + cos(lat₁) × cos(lat₂) × sin²(Δlon / 2)

c = 2 × atan2(√a, √(1 − a))

distance = R × c
```

where `R` is the Earth's radius.

## Technology Stack

### Frontend

- [Svelte](https://svelte.dev/)
- [SvelteKit](https://kit.svelte.dev/)
- JavaScript
- HTML
- CSS

### Maps

- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)

### 360° Panoramas

- [Marzipano](https://www.marzipano.net/)

### Database and Backend

- Supabase
- PostgreSQL

### Authentication

- Supabase Authentication

## Team

TigerTrekkr was developed as a collaborative software engineering project.

### Team Responsibilities

| Team Member | Primary Responsibilities |
|-------------|--------------------------|
| Isaiah | Server, database, and networking |
| Jenaya | Database schema and authentication |
| Gina | Game logic and frontend/backend development |
| Tessa | Image processing and frontend development |
| Anna | Interactive guessing map and frontend consistency |
| Lee Ann | Frontend development |

Team members may contribute to additional areas of the application as needed.

## Future Improvements

Possible future improvements include:

- Additional campus locations and more 360° panoramas
- More game modes
- Expanded leaderboard functionality
- Additional difficulty options
- Mobile support
- Additional player statistics
- More detailed post-round information
- Expanded authentication features

## License

This project was developed as a student software engineering project.

Unless otherwise specified, the source code and project materials are intended for educational and project use.
