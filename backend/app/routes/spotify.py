from fastapi import APIRouter, HTTPException, Request
import os
import base64
import requests
from dotenv import load_dotenv
from pathlib import Path
import json

load_dotenv()

router = APIRouter(
    prefix="/spotify",
    tags=["Spotify"]
)

SPOTIFY_TOKEN_FILE = Path(__file__).resolve().parents[2] / "spotify_tokens.json"

def _get_env(name: str):
    return os.getenv(name)

def _save_tokens(data: dict):
    try:
        with open(SPOTIFY_TOKEN_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f)
    except Exception:
        pass

def _load_tokens():
    if not SPOTIFY_TOKEN_FILE.exists():
        return {}
    try:
        with open(SPOTIFY_TOKEN_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def get_app_token():
    client_id = _get_env("SPOTIFY_CLIENT_ID")
    client_secret = _get_env("SPOTIFY_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise HTTPException(status_code=400, detail="Spotify credentials not configured")

    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    resp = requests.post(
        "https://accounts.spotify.com/api/token",
        data={"grant_type": "client_credentials"},
        headers={"Authorization": f"Basic {auth_header}"}
    )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to obtain Spotify app token")

    return resp.json().get("access_token")


@router.get("/auth_url")
def auth_url():
    client_id = _get_env("SPOTIFY_CLIENT_ID")
    redirect = _get_env("SPOTIFY_REDIRECT_URI")
    if not client_id or not redirect:
        raise HTTPException(status_code=400, detail="Spotify client_id or redirect not configured")

    scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing user-library-read"
    url = (
        "https://accounts.spotify.com/authorize"
        f"?client_id={client_id}"
        "&response_type=code"
        f"&redirect_uri={redirect}"
        f"&scope={requests.utils.quote(scopes)}"
    )
    return {"url": url}


@router.get("/callback")
def callback(code: str = None):
    if not code:
        raise HTTPException(status_code=400, detail="Missing code parameter")

    client_id = _get_env("SPOTIFY_CLIENT_ID")
    client_secret = _get_env("SPOTIFY_CLIENT_SECRET")
    redirect = _get_env("SPOTIFY_REDIRECT_URI")

    resp = requests.post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect,
            "client_id": client_id,
            "client_secret": client_secret
        }
    )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to exchange code for token")

    data = resp.json()
    # store tokens for later use (refresh flow)
    tokens = _load_tokens()
    tokens.update({"user_access_token": data.get("access_token"), "user_refresh_token": data.get("refresh_token")})
    _save_tokens(tokens)

    return {"message": "Spotify authorization successful. You can close this window."}


@router.get("/recommendations")
def recommendations(seed_genres: str = "pop", limit: int = 12):
    token = None
    try:
        token = get_app_token()
    except HTTPException as e:
        raise e

    url = "https://api.spotify.com/v1/recommendations"
    params = {"seed_genres": seed_genres, "limit": limit}
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, params=params, headers=headers)

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Spotify recommendations failed")

    return resp.json()


@router.get("/tokens")
def tokens():
    return _load_tokens()


@router.post("/play")
def play(device_id: str = None, spotify_uri: str = None):
    tokens = _load_tokens()
    access = tokens.get("user_access_token")
    if not access:
        raise HTTPException(status_code=400, detail="No user access token. Authorize via /spotify/auth_url first.")

    url = f"https://api.spotify.com/v1/me/player/play"
    if device_id:
        url += f"?device_id={device_id}"

    body = {"uris": [spotify_uri]} if spotify_uri else {"play": True}
    headers = {"Authorization": f"Bearer {access}", "Content-Type": "application/json"}
    resp = requests.put(url, json=body, headers=headers)

    if resp.status_code not in (200, 204):
        raise HTTPException(status_code=502, detail=f"Playback request failed: {resp.text}")

    return {"message": "Playback requested"}
