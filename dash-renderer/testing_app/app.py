# -*- coding: utf-8 -*-
from multiprocessing import Value
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State

app = dash.Dash(__name__)
app.layout = html.Div(
    [
        dcc.Input(id="input", value="initial value"),
        html.Div(
            html.Div([
                1.5,
                None,
                "string",
                html.Div(
                    id="output-1")
            ])),
    ]
)

call_count = Value("i", 0)

@app.callback(Output("output-1", "children"), [Input("input", "value")])
def update_output(value):
    call_count.value += 1
    return value

app.run_server(debug=True)
