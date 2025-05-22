import logging
import os
from functools import cache

import requests
from dotenv import load_dotenv
from fastapi import APIRouter, Request, Response

from app.bot import graph

_logger = logging.getLogger(__name__)

load_dotenv()

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
FB_API_BASE_URL = os.getenv("FB_API_BASE_URL")
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT"))

router = APIRouter()


def send_message(recipient_id: str, text: str):
    payload = {"recipient": {"id": recipient_id}, "message": {"text": text}}
    params = {"access_token": ACCESS_TOKEN}
    response = requests.post(
        FB_API_BASE_URL + "/me/messages",
        params=params,
        json=payload,
        timeout=REQUEST_TIMEOUT,
    )
    if response.status_code != 200:
        _logger.error(
            "Error sending message: %s - %s", response.status_code, response.text
        )
    return response.json()

@cache
def get_sender_name(sender_id: str) -> str:
    params = {"fields": "first_name,last_name", "access_token": ACCESS_TOKEN}
    response = requests.get(
        FB_API_BASE_URL + "/" + sender_id, params=params, timeout=REQUEST_TIMEOUT
    )
    _logger.info(response)
    if response.status_code != 200:
        _logger.error(
            "Error sending message: %s - %s", response.status_code, response.text
        )
    else:
        data = response.json()
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        return f"{first_name} {last_name}"


@router.get("/webhook")
async def verify_webhook(request: Request):
    fb_token = request.query_params.get("hub.verify_token")

    if fb_token == VERIFY_TOKEN:
        return Response(content=request.query_params["hub.challenge"])

    return Response(content="Failed to verify token", status_code=403)


@router.post("/webhook")
async def receive_webhook(request: Request):
    data = await request.json()
    try:
        entry = data["entry"][0]
        messaging = entry["messaging"][0]
        sender_id = messaging["sender"]["id"]
        message_text = messaging.get("message", {}).get("text")

        if message_text:
            _logger.debug("Received: %s", message_text)
            response = graph.invoke(
                {"messages": message_text},
                config={
                    "configurable": {
                        "thread_id": sender_id,
                        "user": get_sender_name(sender_id),
                    }
                },
            )
            text = response["messages"][-1].content
            send_message(sender_id, text)

        return {"message": "Processed successfully"}

    except Exception as e:
        return {"error": f"Invalid request: {str(e)}"}
