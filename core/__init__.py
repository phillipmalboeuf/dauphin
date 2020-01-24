
from flask import Flask
from flask_pymongo import PyMongo

# from celery import Celery
# from elasticsearch import Elasticsearch, Urllib3HttpConnection
# import certifi


app = Flask(__name__, static_folder='../build')


app.config.from_object('config.environment_default')
try:
	app.config.from_object('config.environment_dev')
except ImportError:
	pass

app.mongo = PyMongo(app)
app.caches = {}

# app.search = Elasticsearch(
# 	app.config['ELASTICSEARCH_HOST'].split(','),
# 	connection_class=Urllib3HttpConnection,
# 	http_auth=(app.config['ELASTICSEARCH_USER'], app.config['ELASTICSEARCH_PASSWORD']),
# 	use_ssl=True,
# 	verify_certs=True,
# 	ca_certs=certifi.where()
# )


# celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
# celery.config_from_object(app.config)

# from core.tasks.execute import execute_task
# from core.tasks.trigger import trigger_tasks
# from core.tasks.scheduled import scheduled_tasks
# from core.tasks.search import search_index, search_delete

from core.pages.pages import *
from core.pages.docs import *
from core.pages.errors import *

from core.helpers.verify_headers import *
from core.helpers.access_control_origin import *
from core.helpers.filters import *


