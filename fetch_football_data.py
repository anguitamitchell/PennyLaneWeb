import urllib.request
import json
import os

# API Endpoints (2025/2026 season compSeasons=777)
STANDINGS_URL = "https://footballapi.pulselive.com/football/standings?compSeasons=777"
# Fetching Liverpool (team ID 10) upcoming fixtures for the current season, sorted by soonest date
FIXTURES_URL = "https://footballapi.pulselive.com/football/fixtures?comps=1&compSeasons=777&teams=10&page=0&pageSize=10&sort=asc&statuses=U,L&altIds=true"

HEADERS = {
    'Origin': 'https://www.premierleague.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def fetch_data(url, filename):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        
        filepath = os.path.join(os.path.dirname(__file__), filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        
        print(f"Successfully saved {filename}")
        return True
    except Exception as e:
        print(f"Error fetching {filename}: {e}")
        return False

if __name__ == "__main__":
    print("Fetching latest Premier League data...")
    standings_success = fetch_data(STANDINGS_URL, "standings.json")
    fixtures_success = fetch_data(FIXTURES_URL, "fixtures.json")
    
    if standings_success and fixtures_success:
        print("Data update complete.")
    else:
        print("Completed with errors.")
