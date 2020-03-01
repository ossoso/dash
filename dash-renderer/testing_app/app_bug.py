import dash

import dash_html_components as html
import dash_core_components as dcc
from dash.dependencies import Output, Input, State

APP = dash.Dash(__name__)
APP.config.suppress_callback_exceptions = True


INDEX_PAGE = html.Div(
    dcc.Link('main', refresh=True, href='/main')
)

MAIN_LAYOUT = html.Div([
    html.Button('Button 1', id='b1', style={'background-color': 'lightsalmon'}),
    dcc.Dropdown(id='dd1', multi=True),
    dcc.Dropdown(id='dd2', multi=True, value=[]),
    dcc.Graph(id='test')
])


APP.layout = html.Div([
    dcc.Location(id='url', refresh=True),
    html.Div(id='page-content'),
])


@APP.callback(
    Output('page-content', 'children'),
    [Input('url', 'pathname')]
)
def display_page(pathname):
    if pathname == '/main':
        return MAIN_LAYOUT

    if pathname == '/':
        return INDEX_PAGE

    return 404


@APP.callback(
    Output('dd1', 'options'),
    [Input('dd2', 'value')]
)
def dd1_opts(dd2_val):
    return []


@APP.callback(
    Output('dd1', 'value'),
    [Input('dd2', 'value')]
)
def dd1_val(dd2_val):
    return []


@APP.callback(
    Output('b1', 'style'),
    [Input('dd1', 'value')]
)
def style_button(val):
    return {}


if __name__ == '__main__':
    APP.run_server(port=6060, threaded=False)