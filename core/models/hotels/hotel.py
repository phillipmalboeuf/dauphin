
from core import app
from flask import request, abort
from werkzeug.routing import Rule

from core.models.core.content import Content
from core.models.core.has_routes import HasRoutes
from core.models.core.with_templates import WithTemplates

from core.helpers.validation_rules import validation_rules
# from core.tasks.trigger import trigger_tasks

from bson.objectid import ObjectId

import urllib




with app.app_context():
	class Hotel(WithTemplates, HasRoutes, Content):

		collection_name = 'hotel'
		# collection_sort = [('order', 1)]

		# schema = {
		# 	'route': validation_rules['text'],
		# 	'name': validation_rules['text'],
		# 	'full_name': validation_rules['text'],
		# 	'tagline': validation_rules['text'],
		# 	'intro': validation_rules['text'],
		# 	'seo_title': validation_rules['text'],
		# 	'seo_description': validation_rules['text'],
		# 	'description': validation_rules['text'],
		# 	'description_1': validation_rules['text'],
		# 	'description_1_icon': validation_rules['text'],
		# 	'description_2': validation_rules['text'],
		# 	'description_2_icon': validation_rules['text'],
		# 	'description_3': validation_rules['text'],
		# 	'description_3_icon': validation_rules['text'],
		# 	'reservation_id': validation_rules['text'],
		# 	'reservation_info': validation_rules['text'],
		# 	'reservation_coupon': validation_rules['text'],
		# 	'featured_photo': validation_rules['text'],
		# 	'photos': validation_rules['image_list'],
		# 	'address': validation_rules['text'],
		# 	'full_address': validation_rules['text'],
		# 	'address_link': validation_rules['text'],
		# 	'phone': validation_rules['text'],
		# 	'fax': validation_rules['text'],
		# 	'toll_free': validation_rules['text'],
		# 	'email': validation_rules['text'],
		# 	'check_in': validation_rules['text'],
		# 	'check_out': validation_rules['text'],
		# 	'policies': validation_rules['items_list'],
		# 	'story': validation_rules['text'],
		# 	'story_photo': validation_rules['text'],
		# 	'proximity_intro': validation_rules['text'],
		# 	'proximity_photo': validation_rules['text'],
		# 	'proximity_restaurants': validation_rules['links_list'],
		# 	'proximity_cafes': validation_rules['links_list'],
		# 	'proximity_bars': validation_rules['links_list'],
		# 	'proximity_quick_bites': validation_rules['links_list'],
		# 	'proximity_others': validation_rules['links_list'],
		# 	'promotions_intro': validation_rules['text'],
		# 	'promotions_body': validation_rules['text'],
		# 	'promotions_photo': validation_rules['text'],
		# 	'metadata': validation_rules['metadata']
		# }


		endpoint = '/hotels'
		routes = [
			{
				'route': '',
				'view_function': 'list_view',
				'methods': ['GET']
			},
			# {
			# 	'route': '',
			# 	'view_function': 'create_view',
			# 	'methods': ['POST']
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
			{
				'route': '/<string:_id>/photos',
				'view_function': 'photos_view',
				'methods': ['GET']
			},
			{
				'route': '/<string:_id>/story',
				'view_function': 'story_view',
				'methods': ['GET']
			},
			{
				'route': '/<string:_id>/proximity',
				'view_function': 'proximity_view',
				'methods': ['GET']
			},
			{
				'route': '/<string:_id>/promotions',
				'view_function': 'promotions_view',
				'methods': ['GET']
			}
			# {
			# 	'route': '/<ObjectId:_id>',
			# 	'view_function': 'delete_view',
			# 	'methods': ['DELETE'],
			# 	'requires_admin': True
			# }
		]

		templates = [
			{
				'view_function': 'get_view',
				'template': 'hotels/hotel.html',
				'response_key': 'hotel'
			},
			{
				'view_function': 'photos_view',
				'template': 'hotels/photos.html',
				'response_key': 'gallery'
			},
			{
				'view_function': 'story_view',
				'template': 'hotels/story.html',
				'response_key': 'hotel'
			},
			{
				'view_function': 'proximity_view',
				'template': 'hotels/proximity.html',
				'response_key': 'hotel'
			},
			{
				'view_function': 'promotions_view',
				'template': 'hotels/promotions.html',
				'response_key': 'hotel'
			}
		]



		@classmethod
		def define_routes(cls):
			# for hotel in ['montreal', 'saint-hyacinthe', 'montreal-longueuil', 'ville-de-quebec', 'drummondville']:
			# 	rule = Rule('/' + hotel, defaults={'_id': hotel}, endpoint=cls.endpoint + '/get_view', methods=['GET'], strict_slashes=False)
			# 	rule.route = {
			# 		'route': '/' + hotel,
			# 		'view_function': 'get_view',
			# 		'methods': ['GET']
			# 	}
			# 	app.url_map.add(rule)

			# 	for lang in app.config['LANGS']:
			# 		rule = Rule('/' + lang + '/' + hotel, defaults={'_id': hotel}, endpoint=cls.endpoint + '/get_view', methods=['GET'], strict_slashes=False)
			# 		rule.route = {
			# 			'route': '/' + lang + '/' + hotel,
			# 			'view_function': 'get_view',
			# 			'methods': ['GET']
			# 		}
			# 		rule.lang = lang
			# 		app.url_map.add(rule)

			return super().define_routes()




		@classmethod
		def preprocess(cls, document, lang=None):
			for cache in app.caches:
				app.caches[cache].clear()

			try:
				document['route'] = urllib.parse.quote_plus(document['route'].lower())
			except KeyError:
				pass

			return super().preprocess(document, lang)




		# VIEWS

		@classmethod
		def photos_view(cls, _id):
			document = cls.get(_id)
			
			return cls._format_response({
				'hotel': document,
				'photos': document['photos']
			})

		@classmethod
		def story_view(cls, _id):
			document = cls.get(_id)
			
			return cls._format_response(document)

		@classmethod
		def proximity_view(cls, _id):
			document = cls.get(_id)
			
			return cls._format_response(document)

		@classmethod
		def promotions_view(cls, _id):
			document = cls.get(_id)
			
			return cls._format_response(document)



		# HELPERS


