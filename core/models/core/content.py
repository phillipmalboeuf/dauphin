from core import app
from flask import request

from datetime import datetime
from pytz import timezone


with app.app_context():
	class Content():

		collection_name = 'models'
		alternate_index = 'identifier'


		@classmethod
		def postprocess(cls, document):
			return document.fields()



		@classmethod
		def list(cls, lang=None):
			return [cls.postprocess(document) for document in app.contentful.entries({ 
				'content_type': cls.collection_name,
				'include': 2,
				'locale': 'en-CA' if lang == 'en' else lang,
				'order': 'sys.createdAt'
			})]


		@classmethod
		def get(cls, identifier, lang=None):
			return [cls.postprocess(document) for document in app.contentful.entries({ 
				'content_type': cls.collection_name,
				'fields.identifier': identifier,
				'include': 2,
				'locale': 'en-CA' if lang == 'en' else lang
			})][0]


