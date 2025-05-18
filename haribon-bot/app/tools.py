import logging

from langchain_core.tools import tool

from app.database import collection
from app.model import RescueReportRequest

_logger = logging.getLogger("tools")


@tool
def emergency_contact() -> str:
    """Return emergency contact numbers for any type of emergency"""
    _logger.debug("Calling tool: emergency_contact")

    return """
        Public Safety Office - Central Communications Center (PSO-COMCEN) Emergency Hotlines
        - Mobile Numbers
            - Globe: 0967-417-7855
            - Smart: 0908-885-3000 | 0908-525-3000 | 0963-220-9700
        - Landline Numbers
            - (054) 472-3000 | 205-2980 loc. 3000
    """


@tool
def typhoon_preparedness_tips() -> str:
    """Return typhoon preparedness tips"""
    _logger.debug("Calling tool: typhoon_preparedness_tips")
    with open("resources/typhoon_preparedness_tips.txt", "r", encoding="utf-8") as file:
        tips = file.read()

    return tips


@tool
def typhoon_rescue_request(rescue_report_request: RescueReportRequest) -> dict:
    """
    Create a typhoon rescue request based on conversation and saves it to the database.

    Args:
        rescue_report_request (RescueReportRequest):
            Information about the people affected, including demographics,
            contact persons, and their location.

    Returns:
        dict: A summary of the rescue request, confirming receipt and details.
    """
    _logger.debug("Calling tool: typhoon_rescue_request")
    _logger.debug("Received: %s", rescue_report_request)

    report_dict = rescue_report_request.model_dump()
    collection.insert_one(report_dict)
    return {
        "status": "complete",
        "rescue_request": rescue_report_request,
        "message": "Rescue request completed and ready for processing.",
    }
