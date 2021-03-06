from core import app
from flask import request, abort

from core.models.core.child_content import ChildContent
from core.models.core.has_child_routes import HasChildRoutes
from core.models.core.with_templates import WithTemplates

from core.helpers.validation_rules import validation_rules

from core.models.hotels.hotel import Hotel

from bson.objectid import ObjectId


with app.app_context():
	class Room(WithTemplates, HasChildRoutes, ChildContent):

		parent = Hotel
		list_name = 'rooms'

		# schema = {
		# 	'name': validation_rules['text'],
		# 	'route': validation_rules['text'],
		# 	'description': validation_rules['text'],
		# 	'featured_photo': validation_rules['text'],
		# 	'photos': validation_rules['image_list'],
		# 	'in_the_room': validation_rules['items_list'],
		# 	'in_the_room_on_demand': validation_rules['items_list'],
		# 	'services': validation_rules['items_list'],
		# 	'paid_services': validation_rules['items_list'],
		# 	'hidden': validation_rules['bool'],
		# 	'metadata': validation_rules['metadata']
		# }


		endpoint = '/rooms'
		routes = [
			{
				'route': '',
				'view_function': 'list_view',
				'methods': ['GET']
			},
			# {
			# 	'route': '',
			# 	'view_function': 'create_view',
			# 	'methods': ['POST'],
			# 	'requires_admin': True
			# },
			{
				'route': '/<string:_id>',
				'view_function': 'get_view',
				'methods': ['GET']
			},
			# {
			# 	'route': '/<ObjectId:_id>',
			# 	'view_function': 'update_view',
			# 	'methods': ['PATCH', 'PUT'],
			# 	'requires_admin': True
			# },
			# {
			# 	'route': '/<ObjectId:_id>',
			# 	'view_function': 'delete_view',
			# 	'methods': ['DELETE'],
			# 	'requires_admin': True
			# },
			{
				'route': '/<string:_id>/photos',
				'view_function': 'photos_view',
				'methods': ['GET']
			}
		]

		templates = [
			{
				'view_function': 'list_view',
				'template': 'hotels/rooms.html',
				'response_key': 'rooms'
			},
			{
				'view_function': 'get_view',
				'template': 'hotels/room.html',
				'response_key': 'room'
			},
			{
				'view_function': 'photos_view',
				'template': 'hotels/photos.html',
				'response_key': 'gallery'
			}
		]





		# VIEWS

		@classmethod
		def photos_view(cls, parent_id, _id):
			document = cls.get(parent_id, _id, lang=request.url_rule.lang)
			
			return cls._format_response({
				'room': document,
				'photos': document['photos']
			})


