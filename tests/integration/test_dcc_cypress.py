from multiprocessing import Value
import datetime
import time
import pytest
from copy import copy

# from bs4 import BeautifulSoup
# from selenium.webdriver.common.keys import Keys

import dash_dangerously_set_inner_html
# import dash_flow_example

import dash_html_components as html
import dash_core_components as dcc

from dash import Dash, callback_context, no_update

from dash.dependencies import Input, Output, State
from dash.exceptions import (
    PreventUpdate,
    DuplicateCallbackOutput,
    CallbackException,
    MissingCallbackContextException,
    InvalidCallbackReturnValue,
    IncorrectTypeException,
    NonExistentIdException,
)
from dash.testing.wait import until

# cypress imports run with .circleci as basedirectory
import cy_utils
def test_callbacks_with_shared_grandparent(dash_thread_server, cy_config):
    app = Dash()

    app.layout = html.Div([
        html.Div(id='session-id', children='id'),
        dcc.Dropdown(id='dropdown-1', options=[
            {'value': 'a', 'label': 'a'},
            {'value': 'b', 'label': 'b'}
        ]),
        dcc.Dropdown(id='dropdown-2', options=[
            {'value': 'a',
            'label': 'a'},
            {'value': 'b',
            'label': 'b'},
            {'value': '1',
            'label': 'dup'},
            {'value': '2',
            'label': 'dup'}
        ]),
    ])

    options = [{'value': 'a', 'label': 'a'}]

    call_counts = {
        'dropdown_1': Value('i', 0),
        'dropdown_2': Value('i', 0)
    }

    # @app.callback(
    #     Output('dropdown-1', 'options'),
    #     [Input('dropdown-1', 'value'),
    #         Input('session-id', 'children')])
    # def dropdown_1(value, session_id):
    #     call_counts['dropdown_1'].value += 1
    #     return options

    # @app.callback(
    #     Output('dropdown-2', 'options'),
    #     [Input('dropdown-2', 'value'),
    #         Input('session-id', 'children')])
    # def dropdown_2(value, session_id):
    #     call_counts['dropdown_2'].value += 1
    #     return options

    dash_thread_server(app)

    cy = cy_config
    spec_result = cy_utils.run_headless(cy.basedir, cy.testname)
    assert 0