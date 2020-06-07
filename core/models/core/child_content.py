from core import app
from flask import request

from datetime import datetime
from pytz import timezone

from core.models.core.content import Content

with app.app_context():
	class ChildContent(Content):

		parent = Content
		list_name = 'models'


		@classmethod
		def postprocess(cls, document, parent):
			document = document.fields()

			if parent is not None:
				document['parent'] = parent.copy()
				del document['parent'][cls.list_name]
				
			return document


		@classmethod
		def list(cls, parent_id, lang=None):

			try:
				parent = cls.parent.get(parent_id, lang=lang)
				return [cls.postprocess(document, parent) for document in parent[cls.list_name]]

			except KeyError:
				return []
			



		@classmethod
		def count(cls, parent_id):

			try:
				return len(cls.parent.get(parent_id)[cls.list_name])

			except KeyError:
				return 0
			




		@classmethod
		def get(cls, parent_id, _id, lang=None):

			try:
				parent = cls.parent.get(parent_id, lang=lang)
				for child in parent[cls.list_name]:
					if (child.fields()['identifier'] == _id) or (child.fields()[cls.alternate_index] == _id):
						return cls.postprocess(child, parent)
				
				abort(404)

			except KeyError:
				abort(404)


