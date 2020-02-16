import flask
import dash
from multiprocessing import Value
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc

typed_keys = Value("i")

server = flask.Flask(__name__)

app = dash.Dash(
    __name__,
    server=server,
    # routes_pathname_prefix='/dash/'
)

app.layout = html.Div([
    dcc.Input(id='my-id', value='initial value', type='text'),
    html.Div(id='my-div')
])


@app.callback(
    Output(component_id='my-div', component_property='children'),
    [Input(component_id='my-id', component_property='value')]
)
def update_output_div(input_value):
    typed_keys.value += 1
    raise rror('asd')
    return 'You\'ve entered "{}"'.format(input_value)

if __name__ == '__main__':
    app.run_server(debug=True, dev_tools_hot_reload=True)