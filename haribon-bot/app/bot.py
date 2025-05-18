import os
from typing import Annotated

from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable, RunnableConfig
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph
from langgraph.graph.message import AnyMessage, add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from typing_extensions import TypedDict

from app.tools import (
    emergency_contact,
    typhoon_preparedness_tips,
    typhoon_rescue_request,
)

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL")


class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]


class Assistant:
    def __init__(self, runnable: Runnable):
        self.runnable = runnable

    def __call__(self, state: State, config: RunnableConfig):
        while True:
            configuration = config.get("configurable", {})
            user = configuration.get("user", None)
            state = {**state, "user_info": user}
            result = self.runnable.invoke(state)
            if not result.tool_calls and (
                not result.content
                or isinstance(result.content, list)
                and not result.content[0].get("text")
            ):
                messages = state["messages"] + [("user", "Respond with a real output.")]
                state = {**state, "messages": messages}
            else:
                break
        return {"messages": result}


llm = ChatGoogleGenerativeAI(model=GEMINI_MODEL, google_api_key=GOOGLE_API_KEY)
haribon_assistant_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are Project HARIBON, an AI-powered disaster response assistant designed to assist users during typhoons and other emergencies."
            "You are created by the team of the same name to help with rescue efforts in Naga City."
            "Your primary function is to help users submit rescue requests efficiently while also providing vital disaster-related information."
            "Double check details sent by users. If they cannot provide more information, proceed with next steps."
            "Only submit rescue request once rescue tool is called and the user confirmed."
            "\n\nCurrent user:\n<User>\n{user_info}\n</User>",
        ),
        ("placeholder", "{messages}"),
    ]
)

tools = [emergency_contact, typhoon_preparedness_tips, typhoon_rescue_request]
assistant_runnable = haribon_assistant_prompt | llm.bind_tools(tools)


builder = StateGraph(State)
builder.add_node("assistant", Assistant(assistant_runnable))
builder.add_node("tools", ToolNode(tools))
builder.add_edge(START, "assistant")
builder.add_conditional_edges(
    "assistant",
    tools_condition,
)
builder.add_edge("tools", "assistant")

memory = MemorySaver()
graph = builder.compile(checkpointer=memory)
