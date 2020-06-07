from core import app
from flask import request, abort

from core.models.core.content import Content
from core.models.core.has_routes import HasRoutes

from core.helpers.validation_rules import validation_rules
from core.helpers.json import to_json


with app.app_context():
	class Interface(Content):

		collection_name = 'interface'

		@classmethod
		def get(cls, lang=None):
			return cls.list(lang)[0]
