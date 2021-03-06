from core import app
from flask import request, abort

from bson.objectid import ObjectId
from datetime import datetime
from pytz import timezone

from core.models.core.model import Model
# from core.tasks.search import search_index, search_delete


with app.app_context():
	class ChildModel(Model):

		parent = Model
		list_name = 'models'


		@classmethod
		def postprocess(cls, document, parent, lang=None):
			if parent is not None:
				document['parent'] = parent.copy()
				del document['parent'][cls.list_name]
				
			return super().postprocess(document, lang)



		@classmethod
		def list(cls, parent_id, limit=0, skip=0, sort=None, lang=None):

			try:
				parent = cls.parent.get(parent_id, lang=lang)
				return [cls.postprocess(document, parent, lang) for document in parent[cls.list_name]]

			except KeyError:
				return []
			



		@classmethod
		def count(cls, parent_id):

			try:
				return len(cls.parent.get(parent_id)[cls.list_name])

			except KeyError:
				return 0
			




		@classmethod
		def get(cls, parent_id, _id, projection={}, lang=None):

			try:
				parent = cls.parent.get(parent_id, projection=projection, lang=lang)
				for child in parent[cls.list_name]:
					if (ObjectId.is_valid(_id) and child['_id'] == ObjectId(_id)) or (child[cls.alternate_index] == _id):
						return cls.postprocess(child, parent, lang)
				
				abort(404)

			except KeyError:
				abort(404)




		@classmethod
		def create(cls, parent_id, document):
			document = cls.preprocess(document)
			document['created_at'] = datetime.now(timezone(app.config['TIMEZONE']))
			document['_id'] = ObjectId()

			cls.parent.update(parent_id, {}, other_operators={'$push': {cls.list_name: document}})

			# search_index.apply_async((cls.parent.collection_name+'_'+cls.list_name, document['_id'], document))

			return {'_id': document['_id']}




		@classmethod
		def update(cls, parent_id, _id, document, projection={}, lang=None):

			document = cls.preprocess(document, lang)
			document['updated_at'] = datetime.now(timezone(app.config['TIMEZONE']))

			for key in document.copy().keys():
				document[cls.list_name+'.$.'+key] = document.pop(key)

			try:
				parent = cls.parent.update_where({'_id': ObjectId(parent_id), cls.list_name: {'$elemMatch': {'_id': ObjectId(_id)}}}, document, projection=projection)
				for child in parent[cls.list_name]:
					if child['_id'] == ObjectId(_id):
						# search_index.apply_async((cls.parent.collection_name+'_'+cls.list_name, child['_id'], child))

						return cls.postprocess(child, parent, lang)

				abort(404)

			except KeyError:
				abort(404)







		@classmethod
		def delete(cls, parent_id, _id):

			cls.parent.update(parent_id, {}, other_operators={'$pull': {cls.list_name: {'_id': ObjectId(_id)}}})
			# search_delete.apply_async((cls.parent.collection_name+'_'+cls.list_name, _id))

			return {'_id': _id, 'parent_route': cls.parent.endpoint + '/' + parent_id}










