import sys
import os
from collections import namedtuple

sys.path.append(os.path.join(os.path.dirname(__file__), 'helpers'))

@pytest.fixture
"""Cypress execution configuration"""
def cy_config(request):
    return namedtuple(**{
        'testname': request.function.__name__,
        'basedir': 'dash-renderer'
        })


# from selenium.webdriver.chrome.options import Options

# def pytest_setup_options():
#     options = Options()
#     options.add_argument('--disable-gpu')
#     return options