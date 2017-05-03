from core import app
from core.helpers.json import to_json, json_formater
from core.helpers.raise_error import raise_error

from core.models.cms.piece import Piece
from core.models.cms.page import Page
from core.models.hotels.hotel import Hotel

from config.redirects import redirects

from flask import request, abort, redirect
from flask import render_template, json

from werkzeug.contrib.cache import SimpleCache

import os


app.caches['/errors'] = SimpleCache()

@app.errorhandler(404)
def not_found(error):


	if 'application/json' in request.headers['Accept']:
		return raise_error('server', 'not_found', 404, no_abort=True)

	else:
		try:
			return redirect(redirects[request.path])

		except KeyError:
			cached_template = app.caches['/errors'].get(request.path)
			if cached_template is None or app.config['DEBUG']:
				response = {
					'pieces': Piece._values(),
					'pages': Page.list(),
					'hotels': Hotel.list(),
					'current_path': request.path,
					'debugging': app.config['DEBUG']
				}
				response['pieces_json'] = json.dumps(response['pieces'], sort_keys=False, default=json_formater)
				response['lang_route'] = '/'

				render = render_template('errors/' + str(error.code) + '.html', **response)
				app.caches['/errors'].set(request.path, render, timeout=0)
				return render

			else:
				return cached_template

