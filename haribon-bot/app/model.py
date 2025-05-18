import os
from datetime import datetime
from zoneinfo import ZoneInfo

from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()

TIMEZONE = ZoneInfo(os.getenv("TIMEZONE"))


class Location(BaseModel):
    latitude: float | None = Field(
        None, description="Latitude coordinate of the location"
    )
    longitude: float | None = Field(
        None, description="Longitude coordinate of the location"
    )
    address: str | None = Field(
        None,
        description="Address of the location, can be just a place or full address, or None",
    )
    landmark: str | None = Field(
        None, description="Nearby landmark to help locate the place"
    )


class Demographics(BaseModel):
    total_children: int = Field(0, description="Number of children affected")
    total_adults: int = Field(0, description="Number of adults affected")
    total_elderly: int = Field(0, description="Number of elderly people affected")


class ContactPerson(BaseModel):
    name: str  = Field(
        description="Full name of the contact person or the current user"
    )
    contact: str | None = Field(
        None, description="Phone number or other contact information"
    )


class RescueReportRequest(BaseModel):
    number_of_people_affected: int | None = Field(
        None,
        description="Total number of people affected by the incident if applicable",
    )
    demographics: Demographics = Field(
        description="Breakdown of affected individuals by age group if applicable.",
    )
    contact_persons: list[ContactPerson] = Field(
        [],
        description="List of people to contact regarding the report",
    )
    location: Location | None = Field(
        None,
        description="Geographic and descriptive information of the affected location",
    )
    status: int = Field(
        0,
        description="Flag indicating rescue status. 0 - Not rescued, 1 - Pending, 2 - Rescued",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(tz=TIMEZONE),
        description="Timestamp when the report was created",
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(tz=TIMEZONE),
        description="Timestamp when the report was last updated",
    )
