import sys
import os
import pytest
from collections import namedtuple

sys.path.append(os.path.join(os.path.dirname(__file__), 'helpers'))

@pytest.fixture
def cy_config(request):
    """Cypress execution configuration"""
    Config = namedtuple('Config', ['testname', 'basedir'])
    return Config(**{
        'testname': request.function.__name__,
        'basedir': 'dash-renderer'
    })


# from selenium.webdriver.chrome.options import Options

# def pytest_setup_options():
#     options = Options()
#     options.add_argument('--disable-gpu')
#     return options