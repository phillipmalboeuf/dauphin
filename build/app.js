(function() {
  var Backbone, Core, _, jQuery;

  window.Core = {
    Collections: {},
    Models: {},
    Views: {},
    Routers: {},
    settings: {
      cdn: "https://d3hy1swj29dtr7.cloudfront.net/",
      api: "http://127.0.0.1:5000/"
    },
    views: [],
    init: function() {
      this.session = new Core.Models.Session();
      this.user = new Core.Models.User();
      this.login_view = new Core.Views.Login();
      this.edit_view = new Core.Views.Edit();
      this.header_view = new Core.Views.Header();
      this.render_views();
      document.addEventListener("turbolinks:render", this.render_views.bind(this));
      return window.onpopstate = function(e) {
        return Turbolinks.visit(window.location.pathname + window.location.search, {
          action: "replace"
        });
      };
    },
    render_views: function() {
      var i, len, ref, view;
      ref = this.views;
      for (i = 0, len = ref.length; i < len; i++) {
        view = ref[i];
        view.undelegateEvents();
      }
      delete this.views;
      this.views = [];
      $("[data-product-id]").each((function(_this) {
        return function(index, element) {
          var model;
          model = new Core.Models.Product({
            "_id": element.getAttribute("data-product-id")
          });
          return _this.views.push(new Core.Views.Product({
            el: element,
            model: model
          }));
        };
      })(this));
      $("[data-shop-id]").each((function(_this) {
        return function(index, element) {
          var model;
          model = new Core.Models.VendorShop({
            "_id": element.getAttribute("data-shop-id")
          });
          return _this.views.push(new Core.Views.VendorShop({
            el: element,
            model: model
          }));
        };
      })(this));
      $("[data-post-id]").each((function(_this) {
        return function(index, element) {
          var model;
          model = new Core.Models.ListPost({
            "_id": element.getAttribute("data-post-id")
          });
          model.urlRoot = Core.settings.api + "lists/" + window.list_id + "/posts";
          return _this.views.push(new Core.Views.Post({
            el: element,
            model: model
          }));
        };
      })(this));
      $("[data-search]").each((function(_this) {
        return function(index, element) {
          return _this.views.push(new Core.Views.Search({
            el: element
          }));
        };
      })(this));
      $("[data-freelancer-id]").each((function(_this) {
        return function(index, element) {
          var model;
          model = new Core.Models.Freelancer({
            "_id": element.getAttribute("data-freelancer-id")
          });
          return _this.views.push(new Core.Views.Freelancer({
            el: element,
            model: model
          }));
        };
      })(this));
      $("[data-piece-id]").each((function(_this) {
        return function(index, element) {
          var model;
          model = new Core.Models.Piece({
            "_id": element.getAttribute("data-piece-id")
          });
          return _this.views.push(new Core.Views.Piece({
            el: element,
            model: model
          }));
        };
      })(this));
      $("[data-navigation]").each((function(_this) {
        return function(index, element) {
          return _this.views.push(new Core.Views.Navigation({
            el: element
          }));
        };
      })(this));
      this.query = Core.helpers.get_query_string();
      if (this.query.login != null) {
        return Core.login_view.show();
      } else {
        if (this.query.signup != null) {
          return Core.login_view.show(null, 1);
        } else {
          return Core.login_view.hide();
        }
      }
    }
  };

  Core = window.Core;

  _ = window._;

  Backbone = window.Backbone;

  jQuery = window.jQuery;

  if (window.saturdays_settings != null) {
    _.extend(Core.settings, window.saturdays_settings);
  }

  $(function() {
    return Core.init();
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Model = (function(superClass) {
    extend(Model, superClass);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype.urlRoot = Core.settings.api + "models";

    Model.prototype.idAttribute = "_id";

    Model.prototype.save = function(data, options, local_only) {
      var e;
      if (options == null) {
        options = {};
      }
      if (local_only == null) {
        local_only = false;
      }
      if (this.local_storage != null) {
        this.set(data);
        try {
          localStorage.setItem(this.local_storage, JSON.stringify(this.toJSON()));
        } catch (_error) {
          e = _error;
          console.log("Warning: localStorage is disabled");
        }
      }
      if (local_only) {
        if (options.success != null) {
          return options.success(this, this.toJSON());
        }
      } else {
        return Model.__super__.save.call(this, data, this.set_secret_header(options));
      }
    };

    Model.prototype.fetch = function(options, local_only) {
      if (options == null) {
        options = {};
      }
      if (local_only == null) {
        local_only = false;
      }
      if ((this.local_storage != null) && (localStorage.getItem(this.local_storage) != null)) {
        this.set(this.parse(JSON.parse(localStorage.getItem(this.local_storage))));
      }
      if (local_only) {
        if (options.success != null) {
          return options.success(this, this.toJSON());
        }
      } else {
        return Model.__super__.fetch.call(this, this.set_secret_header(options));
      }
    };

    Model.prototype.destroy = function(options) {
      if (options == null) {
        options = {};
      }
      if (this.local_storage != null) {
        localStorage.removeItem(this.local_storage);
      }
      return Model.__super__.destroy.call(this, this.set_secret_header(options));
    };

    Model.prototype.clear = function() {
      if (this.local_storage != null) {
        localStorage.removeItem(this.local_storage);
      }
      return Model.__super__.clear.call(this);
    };

    Model.prototype.set_secret_header = function(options) {
      if (options.headers == null) {
        options.headers = {};
      }
      options.headers["Accept"] = "application/json";
      options.headers["X-Session-Secret"] = Core.cookies.get("Session-Secret");
      return options;
    };

    return Model;

  })(Backbone.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.ChildModel = (function(superClass) {
    extend(ChildModel, superClass);

    function ChildModel() {
      return ChildModel.__super__.constructor.apply(this, arguments);
    }

    ChildModel.prototype.endpoint = "child";

    ChildModel.prototype.initialize = function() {
      if (this.has("parent")) {
        this.urlRoot = this.get("parent").url() + "/" + this.endpoint;
      }
      return ChildModel.__super__.initialize.call(this);
    };

    return ChildModel;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Collection = (function(superClass) {
    extend(Collection, superClass);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.model = Core.Model;

    Collection.prototype.fetch = function(options) {
      if (options == null) {
        options = {};
      }
      return Collection.__super__.fetch.call(this, Core.Model.prototype.set_secret_header(options));
    };

    return Collection;

  })(Backbone.Collection);

}).call(this);

(function() {
  window.Core.cookies = {
    set: function(name, value, expiry_days) {
      var d, expires;
      d = new Date();
      d.setTime(d.getTime() + (expiry_days * 24 * 60 * 60 * 1000));
      expires = "expires=" + d.toGMTString();
      return document.cookie = "X-" + name + "=" + value + "; " + expires + "; path=/";
    },
    set_for_a_session: function(name, value) {
      return document.cookie = "X-" + name + "=" + value + "; path=/";
    },
    get: function(name) {
      var cookie, cookies, fn, i, len, value;
      name = "X-" + name + "=";
      value = false;
      cookies = document.cookie.split(';');
      fn = function(cookie) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
          return value = cookie.substring(name.length, cookie.length);
        }
      };
      for (i = 0, len = cookies.length; i < len; i++) {
        cookie = cookies[i];
        fn(cookie);
      }
      if (!value) {
        value = null;
      }
      return value;
    },
    "delete": function(name) {
      return document.cookie = 'X-' + name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }
  };

}).call(this);

(function() {
  Core.helpers = {
    upload: function(file, options) {
      var data;
      if (options == null) {
        options = {};
      }
      data = new FormData();
      data.append("file", file);
      Turbolinks.controller.adapter.progressBar.setValue(0);
      Turbolinks.controller.adapter.progressBar.show();
      return $.ajax({
        type: "POST",
        url: Core.settings.api + "_upload",
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        headers: {
          "X-Session-Secret": Core.cookies.get("Session-Secret")
        },
        success: function(response) {
          Turbolinks.controller.adapter.progressBar.setValue(100);
          Turbolinks.controller.adapter.progressBar.hide();
          if (options.success != null) {
            return options.success(response);
          }
        }
      });
    },
    get_query_string: function() {
      var m, query_string, regex, result;
      result = {};
      query_string = location.search.slice(1);
      regex = /([^&=]+)=([^&]*)/g;
      m = null;
      while ((m = regex.exec(query_string))) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
      return result;
    }
  };

  String.prototype.capitalize = function() {
    var array, string;
    array = this.split(" ");
    string = "";
    _.each(array, function(piece) {
      return string += piece.charAt(0).toUpperCase() + piece.slice(1) + " ";
    });
    return string.trim();
  };

}).call(this);

(function() {
  Handlebars.registerHelper('first', function(models, options) {
    if ((models != null) && (models[0] != null)) {
      return options.fn(models[0]);
    } else {
      return null;
    }
  });

  Handlebars.registerHelper('last', function(models, options) {
    if ((models != null) && (models[models.length - 1] != null)) {
      return options.fn(models[models.length - 1]);
    } else {
      return null;
    }
  });

  Handlebars.registerHelper('get', function(model, key) {
    if ((model != null) && (model[key] != null)) {
      return model[key];
    } else {
      return null;
    }
  });

  Handlebars.registerHelper('if_get', function(model, key, options) {
    if ((model[key] != null) && model[key]) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('unless_get', function(model, key, options) {
    if ((model[key] != null) && model[key]) {
      return null;
    } else {
      return options.fn(this);
    }
  });

  Handlebars.registerHelper('if_equal', function(left, right, options) {
    if (left === right) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('if_lower', function(left, right, options) {
    if (left < right) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('if_higher', function(left, right, options) {
    if (left > right) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('if_get_equal', function(model, key, right, options) {
    if ((model[key] != null) && model[key] === right) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('unless_equal', function(left, right, options) {
    if (left !== right) {
      return options.fn(this);
    } else {
      return null;
    }
  });

  Handlebars.registerHelper('if_in_array', function(array, right, options) {
    if ((array != null) && _.contains(array, right)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('date', function(date) {
    date = new Date(date);
    return date.toLocaleDateString();
  });

  Handlebars.registerHelper('datetime', function(date) {
    date = new Date(date);
    return date.toLocaleString();
  });

  Handlebars.registerHelper('if_dates_equal', function(left, right, options) {
    left = new Date(left);
    right = new Date(right);
    if (left.toLocaleDateString() === right.toLocaleDateString()) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('json', function(json) {
    return JSON.stringify(JSON.parse(json), void 0, 2);
  });

  Handlebars.registerHelper('address', function(address) {
    var address_text;
    address_text = "";
    if (address != null) {
      if (address.name != null) {
        address.first_name = address.name;
        address.last_name = "";
      }
      address_text += address.first_name + " " + address.last_name + "<br>" + address.street;
      if ((address.street_continued != null) && address.street_continued !== "") {
        address_text += address.street_continued;
      }
      address_text += " " + address.city + ", " + address.region + ", " + address.country + " " + address.zip;
    }
    return address_text;
  });

  Handlebars.registerHelper('money', function(value) {
    if (value != null) {
      return "$" + (parseFloat(value)).toFixed(2);
    } else {
      return null;
    }
  });

  Handlebars.registerHelper('percentage', function(value) {
    return (value * 100) + "%";
  });

  Handlebars.registerHelper('ms', function(value) {
    return (parseFloat(value)).toFixed(3) + "ms";
  });

  Handlebars.registerHelper('plus', function(left, right) {
    return left + right;
  });

  Handlebars.registerHelper('minus', function(left, right) {
    return left - right;
  });

  Handlebars.registerHelper('times', function(value, times) {
    return value * times;
  });

  Handlebars.registerHelper('divide', function(left, right) {
    return left / right;
  });

  Handlebars.registerHelper('encode_uri', function(url) {
    return encodeURIComponent(url);
  });

  Handlebars.registerHelper('first_letter', function(string) {
    if (string != null) {
      return string[0].toUpperCase();
    }
  });

  Handlebars.registerHelper('first_word', function(string) {
    if (string != null) {
      return string.split(" ")[0];
    }
  });

  Handlebars.registerHelper('name_from_email', function(email) {
    if (email != null) {
      return email.split("@")[0];
    }
  });

  Handlebars.registerHelper('first_name_from_name', function(name) {
    if (name != null) {
      return name.split(" ")[0];
    }
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.View = (function(superClass) {
    extend(View, superClass);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.template = null;

    View.prototype.templates = null;

    View.prototype.data = {};

    View.prototype.events = {};

    View.prototype.initialize = function() {
      if (Core.session != null) {
        this.listenTo(Core.session, "sync", this.render);
      }
      if (Core.user != null) {
        this.listenTo(Core.user, "sync", this.render);
      }
      _.extend(this.data, {
        pieces: window.pieces,
        current_path: window.current_path
      });
      return this.render();
    };

    View.prototype.render = function() {
      var html;
      _.extend(this.data, Core.session != null ? {
        session: Core.session.toJSON()
      } : void 0, Core.user != null ? {
        user: Core.user.toJSON()
      } : void 0, Core.session != null ? {
        is_authenticated: Core.session.has("user_id")
      } : void 0);
      if ((Core.user != null) && (this.model != null)) {
        _.extend(this.data, {
          has_permission: Core.user.get("is_admin") || ((this.model.get("user_id") != null) && Core.user.id === this.model.get("user_id"))
        });
      } else {
        _.extend(this.data, {
          has_permission: false
        });
      }
      if (this.templates != null) {
        html = "";
        _.each(this.templates, (function(_this) {
          return function(template) {
            return html += template(_this.data);
          };
        })(this));
        this.$el.html(html);
      } else {
        if (this.template != null) {
          this.$el.html(this.template(this.data));
        }
      }
      View.__super__.render.call(this);
      $(document.links).filter(function() {
        return this.hostname !== window.location.hostname;
      }).attr('target', '_blank');
      this.delegateEvents();
      return this;
    };

    return View;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.Author = (function(superClass) {
    extend(Author, superClass);

    function Author() {
      return Author.__super__.constructor.apply(this, arguments);
    }

    Author.prototype.urlRoot = Core.settings.api + "authors";

    return Author;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.List = (function(superClass) {
    extend(List, superClass);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.urlRoot = Core.settings.api + "lists";

    return List;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.ListPost = (function(superClass) {
    extend(ListPost, superClass);

    function ListPost() {
      return ListPost.__super__.constructor.apply(this, arguments);
    }

    return ListPost;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.Piece = (function(superClass) {
    extend(Piece, superClass);

    function Piece() {
      return Piece.__super__.constructor.apply(this, arguments);
    }

    Piece.prototype.urlRoot = Core.settings.api + "pieces";

    return Piece;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.Survey = (function(superClass) {
    extend(Survey, superClass);

    function Survey() {
      return Survey.__super__.constructor.apply(this, arguments);
    }

    Survey.prototype.urlRoot = Core.settings.api + "surveys";

    return Survey;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.SurveyAnswer = (function(superClass) {
    extend(SurveyAnswer, superClass);

    function SurveyAnswer() {
      return SurveyAnswer.__super__.constructor.apply(this, arguments);
    }

    return SurveyAnswer;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.Freelancer = (function(superClass) {
    extend(Freelancer, superClass);

    function Freelancer() {
      return Freelancer.__super__.constructor.apply(this, arguments);
    }

    Freelancer.prototype.urlRoot = Core.settings.api + "freelancers";

    return Freelancer;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.Session = (function(superClass) {
    extend(Session, superClass);

    function Session() {
      return Session.__super__.constructor.apply(this, arguments);
    }

    Session.prototype.urlRoot = Core.settings.api + "sessions";

    Session.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      return this.set({
        _id: Core.cookies.get("Session-Id"),
        secret: Core.cookies.get("Session-Secret"),
        user_id: Core.cookies.get("User-Id"),
        token_id: Core.cookies.get("Token-Id")
      });
    };

    Session.prototype.login = function(data, options) {
      if (data == null) {
        data = {};
      }
      if (options == null) {
        options = {};
      }
      return Core.session.save(data, {
        success: function(model, response) {
          var query;
          Core.cookies.set("Session-Id", response._id);
          Core.cookies.set("Session-Secret", response.secret);
          Core.cookies.set("User-Id", response.user_id);
          Core.user.initialize();
          query = Core.helpers.get_query_string();
          if (query.token_code != null) {
            Core.cookies.set("Token-Id", response.token_id);
            return window.location = "?edit=true";
          }
        }
      });
    };

    Session.prototype.logout = function() {
      this.clear();
      Core.user.clear();
      Core.cookies["delete"]("Session-Id");
      Core.cookies["delete"]("Session-Secret");
      Core.cookies["delete"]("User-Id");
      Core.cookies["delete"]("Token-Id");
      Core.cookies["delete"]("Cart-Id");
      return window.location = window.location.pathname;
    };

    Session.prototype.is_authenticated = function() {
      return Core.cookies.get("User-Id") != null;
    };

    return Session;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.Token = (function(superClass) {
    extend(Token, superClass);

    function Token() {
      return Token.__super__.constructor.apply(this, arguments);
    }

    Token.prototype.urlRoot = Core.settings.api + "tokens";

    return Token;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Models.User = (function(superClass) {
    extend(User, superClass);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.urlRoot = Core.settings.api + "users";

    User.prototype.initialize = function(options) {
      var user_id;
      if (options == null) {
        options = {};
      }
      if (options._id == null) {
        user_id = Core.cookies.get("User-Id");
        if (user_id != null) {
          this.set({
            _id: user_id
          });
          return this.fetch();
        }
      }
    };

    User.prototype.signup = function(data, options) {
      if (options == null) {
        options = {};
      }
      return this.save(data, {
        success: function(model, response) {
          if (options.success != null) {
            return options.success(model, response);
          }
        }
      });
    };

    return User;

  })(Core.Model);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Slider = (function(superClass) {
    extend(Slider, superClass);

    function Slider() {
      return Slider.__super__.constructor.apply(this, arguments);
    }

    Slider.prototype.current_slide = 0;

    Slider.prototype.initialize = function() {
      this.events["click [data-next-slide-button]"] = "next_slide";
      this.events["click [data-previous-slide-button]"] = "previous_slide";
      this.events["click [data-slide-marker]"] = "slide_to";
      this.events["click [data-hide]"] = "hide";
      return Slider.__super__.initialize.call(this);
    };

    Slider.prototype.render = function() {
      _.extend(this.data, {
        current_slide: this.current_slide
      });
      Slider.__super__.render.call(this);
      this.previous_slide_height = this.$el.find("[data-slide=" + this.current_slide + "] [data-slide-content]").height();
      this.$el.find("[data-slider-container]").css("height", "-=" + (this.$el.find("[data-slide=" + this.current_slide + "]").height() - this.previous_slide_height) + "px");
      this.$el.find("[data-slide]").css("transform", "translateX(-" + this.current_slide + "00%)");
      return this;
    };

    Slider.prototype.next_slide = function() {
      return this.slide_to(null, this.current_slide + 1);
    };

    Slider.prototype.previous_slide = function() {
      return this.slide_to(null, this.current_slide - 1);
    };

    Slider.prototype.slide_to = function(e, index) {
      var slide_height;
      if (e != null) {
        index = parseInt(e.currentTarget.getAttribute("data-slide-marker"));
        e.preventDefault();
        e.currentTarget.blur();
      }
      this.current_slide = index;
      this.$el.find("[data-slide-marker]").removeClass("slider__marker--active");
      this.$el.find("[data-slide-marker=" + this.current_slide + "]").addClass("slider__marker--active");
      slide_height = this.$el.find("[data-slide=" + this.current_slide + "] [data-slide-content]").height();
      this.$el.find("[data-slider-container]").css("height", "-=" + (this.previous_slide_height - slide_height) + "px");
      this.previous_slide_height = slide_height;
      this.$el.find("[data-slide]").css("transform", "translateX(-" + this.current_slide + "00%)");
      return setTimeout((function(_this) {
        return function() {
          return _this.$el.find("[data-slide=" + _this.current_slide + "] input:not([disabled]):first").focus();
        };
      })(this), 333);
    };

    Slider.prototype.show = function(e, index) {
      if (index == null) {
        index = 0;
      }
      if (e != null) {
        e.preventDefault();
      }
      this.current_slide = index;
      this.render();
      return this.$el.removeClass("fade_out");
    };

    Slider.prototype.hide = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      return this.$el.addClass("fade_out");
    };

    return Slider;

  })(Core.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Editable = (function(superClass) {
    extend(Editable, superClass);

    function Editable() {
      return Editable.__super__.constructor.apply(this, arguments);
    }

    Editable.prototype.edit_admin_template = templates["cms/edit"];

    Editable.prototype.tags_template = templates["cms/tags"];

    Editable.prototype.tag_template = templates["cms/tag"];

    Editable.prototype.initialize = function() {
      this.events["input input"] = "key_input";
      this.events["change input"] = "key_input";
      this.events["input [contenteditable]"] = "key_input";
      this.events["click [data-save]"] = "save_edit";
      this.events["click [data-destroy]"] = "destroy";
      this.events["click [data-add-tag]"] = "add_tag";
      this.events["click [data-remove-tag]"] = "remove_tag";
      this.events["click [data-image]"] = "trigger_upload";
      this.events["change [data-image-input]"] = "upload_image";
      this.listenTo(this.model, "sync", this.render);
      this.model.fetch();
      return Editable.__super__.initialize.call(this);
    };

    Editable.prototype.render = function() {
      _.extend(this.data, {
        model: this.model.toJSON()
      });
      Editable.__super__.render.call(this);
      if (this.data.has_permission) {
        this.$el.find("[data-image]").addClass("img--clickable");
        this.$el.find("[data-tags]").html(this.tags_template({
          tags: this.data.model.tags,
          name: "tag"
        }));
        this.$el.find("[data-admin]").html(this.edit_admin_template(this.data));
        this.button = this.$el.find("[data-save]")[0];
        this.delegateEvents();
      }
      return this;
    };

    Editable.prototype.save_edit = function(e) {
      var image, tags;
      Turbolinks.controller.adapter.progressBar.setValue(0);
      Turbolinks.controller.adapter.progressBar.show();
      tags = [];
      this.$el.find("[data-tag]").each((function(_this) {
        return function(index, tag) {
          return tags.push(tag.innerHTML);
        };
      })(this));
      this.model.attributes.tags = tags;
      image = this.$el.find("[src][data-image]");
      if (image.length) {
        this.model.set({
          image: image.attr("src").replace(image.attr("data-image-cdn"), "")
        });
      }
      return this.model.save({}, {
        success: (function(_this) {
          return function(model, response) {
            Turbolinks.controller.adapter.progressBar.setValue(100);
            return Turbolinks.controller.adapter.progressBar.hide();
          };
        })(this)
      });
    };

    Editable.prototype.destroy = function() {
      if (confirm("Are you sure?")) {
        return this.model.destroy({
          success: function(model, response) {}
        });
      }
    };

    Editable.prototype.key_input = function(e) {
      if ((this.button != null) && this.button.hasAttribute("disabled")) {
        return this.button.removeAttribute("disabled");
      }
    };

    Editable.prototype.add_tag = function(e) {
      this.insert_tag(e.currentTarget);
      return $(e.currentTarget).parents("[data-tags]").find("[data-tag]").last().focus();
    };

    Editable.prototype.remove_tag = function(e) {
      return $(e.currentTarget).parents(".tag").remove();
    };

    Editable.prototype.trigger_upload = function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.$el.find("[data-image-input]").click();
      return this.image_to_upload = e.currentTarget;
    };

    Editable.prototype.upload_image = function(e) {
      var file;
      file = e.currentTarget.files[0];
      if (file.type.match('image.*')) {
        return Core.helpers.upload(file, {
          success: (function(_this) {
            return function(response) {
              $(_this.image_to_upload).attr("src", Core.settings.cdn + response.url);
              return _this.key_input();
            };
          })(this)
        });
      }
    };

    Editable.prototype.insert_tag = function(target) {
      var fn, i, len, value, values;
      values = target.value.trim().split(",");
      fn = (function(_this) {
        return function(value) {
          return $(_this.tag_template({
            tag: value.trim()
          })).insertBefore($(target));
        };
      })(this);
      for (i = 0, len = values.length; i < len; i++) {
        value = values[i];
        fn(value);
      }
      return target.value = "";
    };

    return Editable;

  })(Core.View);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Login = (function(superClass) {
    extend(Login, superClass);

    function Login() {
      this.check_escape = bind(this.check_escape, this);
      return Login.__super__.constructor.apply(this, arguments);
    }

    Login.prototype.el = $("#login");

    Login.prototype.template = templates["user/login"];

    Login.prototype.events = {
      "submit [data-login-form]": "submit_login",
      "submit [data-signup-form]": "submit_signup",
      "submit [data-forgot-password-form]": "submit_forgot_password",
      "click [data-logout]": "logout"
    };

    Login.prototype.initialize = function() {
      $(document).on("keyup", this.check_escape);
      return Login.__super__.initialize.call(this);
    };

    Login.prototype.render = function() {
      _.extend(this.data, {
        categories: window.categories
      });
      Login.__super__.render.call(this);
      return this;
    };

    Login.prototype.submit_login = function(e) {
      e.preventDefault();
      return Core.session.login({
        email: e.currentTarget["email"].value,
        password: e.currentTarget["password"].value
      });
    };

    Login.prototype.submit_signup = function(e) {
      var freelancer, tags;
      e.preventDefault();
      Turbolinks.controller.adapter.progressBar.setValue(0);
      Turbolinks.controller.adapter.progressBar.show();
      tags = [];
      $(e.currentTarget).find("[data-tags] [type='checkbox']:checked").each(function(index, input) {
        return tags.push(input.name);
      });
      freelancer = new Core.Models.Freelancer();
      return freelancer.save({
        email: e.currentTarget["email"].value,
        first_name: e.currentTarget["first_name"].value,
        last_name: e.currentTarget["last_name"].value,
        tags: tags
      }, {
        success: (function(_this) {
          return function(model, response) {
            Core.user.set({
              is_freelancer: true
            });
            _this.render();
            _this.slide_to(null, 0);
            Turbolinks.controller.adapter.progressBar.setValue(100);
            return Turbolinks.controller.adapter.progressBar.hide();
          };
        })(this)
      });
    };

    Login.prototype.submit_forgot_password = function(e) {
      var token;
      e.preventDefault();
      token = new Core.Models.Token();
      return token.save({
        email: e.currentTarget["email"].value
      }, {
        success: (function(_this) {
          return function(model, response) {
            return _this.$el.find("[data-success]").html("<span class='highlight'>A request was sent to your email address.</span>");
          };
        })(this)
      });
    };

    Login.prototype.logout = function(e) {
      e.preventDefault();
      return Core.session.logout();
    };

    Login.prototype.check_escape = function(e) {
      if (e.keyCode === 27) {
        if (this.$el.hasClass("fade_out")) {
          return this.show();
        } else {
          return this.hide();
        }
      }
    };

    Login.prototype.show = function(e, index) {
      return Login.__super__.show.call(this, e, index);
    };

    Login.prototype.hide = function(e) {
      window.history.replaceState(null, null, location.pathname);
      return Login.__super__.hide.call(this, e);
    };

    return Login;

  })(Core.Views.Slider);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Piece = (function(superClass) {
    extend(Piece, superClass);

    function Piece() {
      return Piece.__super__.constructor.apply(this, arguments);
    }

    Piece.prototype.piece_admin_template = templates["cms/piece_edit"];

    Piece.prototype.piece_link_template = templates["cms/piece_link"];

    Piece.prototype.events = {
      "click .js-save_piece": "save_piece",
      "input [data-key]": "key_input",
      "click [data-key]": "prevent_click",
      "click [data-image-key]": "trigger_upload",
      "change .js-image_input": "upload_image"
    };

    Piece.prototype.initialize = function() {
      this.listenTo(this.model, "sync", this.render);
      if (Core.user != null) {
        if (Core.user.get("is_admin")) {
          this.model.fetch();
        } else {
          this.listenToOnce(Core.user, "sync", (function(_this) {
            return function() {
              if (Core.user.get("is_admin")) {
                return _this.model.fetch();
              }
            };
          })(this));
        }
      }
      return Piece.__super__.initialize.call(this);
    };

    Piece.prototype.render = function() {
      Piece.__super__.render.call(this);
      if (this.data.is_admin) {
        this.$el.find("[data-key]").attr("contenteditable", "true");
        this.$el.find("[data-link-key]").each((function(_this) {
          return function(index, link) {
            $(link).before(_this.piece_link_template({
              key: link.getAttribute("data-link-key"),
              link: link.getAttribute("href")
            }));
            return link.removeAttribute("data-link-key");
          };
        })(this));
        this.$el.find("[data-image-key]").each((function(_this) {
          return function(index, image) {
            return $(image).addClass("img--clickable");
          };
        })(this));
        this.$el.find("[data-piece-admin]").html(this.piece_admin_template(this.data));
        this.button = this.$el.find(".js-save_piece")[0];
      }
      return this;
    };

    Piece.prototype.save_piece = function(e) {
      e.preventDefault();
      this.$el.find("[data-key]").each((function(_this) {
        return function(index, key) {
          return _this.model.attributes.content[key.getAttribute("data-key")].value = key.innerHTML;
        };
      })(this));
      this.$el.find("[data-image-key]").each((function(_this) {
        return function(index, key) {
          return _this.model.attributes.content[key.getAttribute("data-image-key")].value = key.getAttribute("src");
        };
      })(this));
      return this.model.save();
    };

    Piece.prototype.key_input = function(e) {
      if (this.button.hasAttribute("disabled")) {
        return this.button.removeAttribute("disabled");
      }
    };

    Piece.prototype.trigger_upload = function(e) {
      var input;
      input = this.$el.find(".js-image_input");
      this.image_key = e.currentTarget.getAttribute("data-image-key");
      return input.click();
    };

    Piece.prototype.upload_image = function(e) {
      var file;
      file = e.currentTarget.files[0];
      if (file.type.match('image.*')) {
        return Core.helpers.upload(file, {
          success: (function(_this) {
            return function(response) {
              _this.$el.find("[data-image-key='" + _this.image_key + "']").attr("src", Core.settings.cdn + response.url);
              return _this.key_input();
            };
          })(this)
        });
      }
    };

    Piece.prototype.prevent_click = function(e) {
      if (this.data.is_admin) {
        return e.preventDefault();
      }
    };

    return Piece;

  })(Core.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Post = (function(superClass) {
    extend(Post, superClass);

    function Post() {
      return Post.__super__.constructor.apply(this, arguments);
    }

    Post.prototype.author_input_template = templates["cms/author_input"];

    Post.prototype.author_template = templates["cms/author"];

    Post.prototype.events = {
      "click .js-maximize": "maximize",
      "click .js-minimize": "minimize",
      "drop [data-is-markdown]": "drop_image"
    };

    Post.prototype.initialize = function() {
      if (Core.authors == null) {
        Core.authors = new Core.Collections.Authors();
      }
      this.listenTo(Core.authors, "sync", this.render);
      Core.authors.fetch();
      return Post.__super__.initialize.call(this);
    };

    Post.prototype.render = function() {
      _.extend(this.data, {
        authors: Core.authors.toJSON()
      });
      Post.__super__.render.call(this);
      if (this.data.is_admin) {
        this.$el.find("[data-title]").attr("contenteditable", "true");
        this.$el.find("[data-published-date]").attr("contenteditable", "true");
        this.$el.find("[data-content-key]").attr("contenteditable", "true");
        this.$el.find("[data-author-input]").html(this.author_input_template(this.data));
        this.delegateEvents();
      }
      return this;
    };

    Post.prototype.save_edit = function(e) {
      var value;
      console.log(this.model);
      this.model.set({
        title: this.$el.find("[data-title]").html(),
        published_date: this.$el.find("[data-published-date]").html(),
        authors: this.$el.find("[name='authors']").val()
      });
      value = "";
      this.$el.find("[data-content-key]").each((function(_this) {
        return function(index, content) {
          value = content.innerHTML;
          if (content.getAttribute("data-is-markdown") != null) {
            value = toMarkdown(content.innerHTML);
            content.innerHTML = marked(value);
          }
          return _this.model.attributes.content[content.getAttribute("data-content-key")].value = value;
        };
      })(this));
      return Post.__super__.save_edit.call(this);
    };

    Post.prototype.maximize = function(e) {
      e.preventDefault();
      $(e.currentTarget).addClass("hide");
      this.$el.find(".js-minimize").removeClass("hide");
      this.$el.find(".blog__post__content").removeClass("blog__post__content--minimized");
      return Core.router.navigate(e.currentTarget.getAttribute("href"));
    };

    Post.prototype.minimize = function(e) {
      e.preventDefault();
      $(e.currentTarget).addClass("hide");
      this.$el.find(".js-maximize").removeClass("hide");
      this.$el.find(".blog__post__content").addClass("blog__post__content--minimized");
      return Core.router.navigate("/lists/blog");
    };

    Post.prototype.drop_image = function(e) {
      var file;
      e.preventDefault();
      e.stopPropagation();
      file = e.originalEvent.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        return Core.helpers.upload(file, {
          success: function(response) {
            return $(e.target).before("<p>![" + response.file_name + "](" + Core.settings.cdn + response.url + ")</p>");
          }
        });
      }
    };

    return Post;

  })(Core.Views.Editable);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Survey = (function(superClass) {
    extend(Survey, superClass);

    function Survey() {
      return Survey.__super__.constructor.apply(this, arguments);
    }

    Survey.prototype.answers_template = templates["answers"];

    Survey.prototype.events = {
      "submit": "submit_form"
    };

    Survey.prototype.initialize = function() {
      this.survey = new Core.Models.Survey({
        "_id": this.$el.attr("data-survey-id")
      });
      this.survey.fetch();
      this.listenTo(this.survey, "sync", this.render);
      return this.render();
    };

    Survey.prototype.render = function() {
      if (localStorage.getItem("survey_" + this.survey.id + "_answers") != null) {
        this.$el.html(this.answers_template(JSON.parse(localStorage.getItem("survey_" + this.survey.id + "_answers"))));
      }
      return this;
    };

    Survey.prototype.submit_form = function(e) {
      var answers, form, i, len, question, ref;
      e.preventDefault();
      form = e.currentTarget;
      answers = [];
      form.setAttribute("disabled", "disabled");
      ref = this.survey.get("questions");
      for (i = 0, len = ref.length; i < len; i++) {
        question = ref[i];
        if (form[question["key"]] != null) {
          if (form[question["key"]].value === "") {
            $(form[question["key"]]).focus();
            return false;
          }
          answers.push({
            question_key: question["key"],
            value: form[question["key"]].value.capitalize()
          });
        }
      }
      this.survey_answer = new Core.Models.SurveyAnswer();
      this.survey_answer.local_storage = "survey_answer";
      this.survey_answer.urlRoot = Core.settings.api + "surveys/" + this.survey.id + "/answers";
      return this.survey_answer.save({
        answers: answers
      }, {
        success: (function(_this) {
          return function(model, response) {
            localStorage.setItem("survey_" + _this.survey.id + "_answers", JSON.stringify(answers));
            _this.render();
            return form.removeAttribute("disabled");
          };
        })(this)
      });
    };

    return Survey;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Edit = (function(superClass) {
    extend(Edit, superClass);

    function Edit() {
      return Edit.__super__.constructor.apply(this, arguments);
    }

    Edit.prototype.el = $("#edit");

    Edit.prototype.template = templates["user/edit"];

    Edit.prototype.events = {
      "submit [data-edit-form]": "submit_edit"
    };

    Edit.prototype.initialize = function() {
      Edit.__super__.initialize.call(this);
      return $(document).off("keyup", this.check_escape);
    };

    Edit.prototype.render = function() {
      Edit.__super__.render.call(this);
      return this;
    };

    Edit.prototype.submit_edit = function(e) {
      e.preventDefault();
      return Core.user.save({
        password: e.currentTarget["password"].value
      }, {
        patch: true,
        success: (function(_this) {
          return function(model, response) {
            return _this.$el.find("[data-success]").html("<span class='highlight'>Your password was updated successfully.</span>");
          };
        })(this)
      });
    };

    return Edit;

  })(Core.Views.Login);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Freelancer = (function(superClass) {
    extend(Freelancer, superClass);

    function Freelancer() {
      return Freelancer.__super__.constructor.apply(this, arguments);
    }

    Freelancer.prototype.edit_admin_template = templates["freelancers/admin"];

    Freelancer.prototype.route_box_template = templates["freelancers/route_box"];

    Freelancer.prototype.edit_box_template = templates["freelancers/edit_box"];

    Freelancer.prototype.is_available_template = templates["freelancers/is_available"];

    Freelancer.prototype.links_template = templates["freelancers/links"];

    Freelancer.prototype.link_template = templates["freelancers/link"];

    Freelancer.prototype.projects_template = templates["freelancers/projects"];

    Freelancer.prototype.project_template = templates["freelancers/project"];

    Freelancer.prototype.events = {
      "click [data-add-link]": "add_link",
      "click [data-remove-link]": "remove_link",
      "click [data-add-project]": "add_project",
      "click [data-remove-project]": "remove_project",
      "change [name='is_available']": "change_is_available",
      "click [data-project-image]": "trigger_upload",
      "click [data-show-edit]": "show_edit"
    };

    Freelancer.prototype.initialize = function() {
      return Freelancer.__super__.initialize.call(this);
    };

    Freelancer.prototype.render = function() {
      Freelancer.__super__.render.call(this);
      if (this.data.has_permission) {
        this.$el.find("[data-first-name]").attr("contenteditable", "true");
        this.$el.find("[data-last-name]").attr("contenteditable", "true");
        this.$el.find("[data-bio]").attr("contenteditable", "true");
        this.$el.find("[data-rate]").attr("contenteditable", "true");
        this.$el.find("[data-route-box]").html(this.route_box_template(this.data));
        this.$el.find("[data-skills]").html(this.tags_template({
          tags: this.data.model.skills,
          name: "skill"
        }));
        this.$el.find("[data-edit-box]").html(this.edit_box_template(this.data));
        this.$el.find("[data-is-available]").html(this.is_available_template(this.data));
        this.$el.find("[data-links]").html(this.links_template({
          links: this.data.model.links
        }));
        this.$el.find("[data-projects]").html(this.projects_template({
          projects: this.data.model.projects
        }));
        this.delegateEvents();
      }
      return this;
    };

    Freelancer.prototype.save_edit = function(e) {
      this.model.set({
        first_name: this.$el.find("[data-first-name]").text(),
        last_name: this.$el.find("[data-last-name]").text(),
        rate: this.$el.find("[data-rate]").text(),
        bio: this.$el.find("[data-bio]").html(),
        route: this.$el.find("[data-route]").text(),
        is_available: this.$el.find("[name='is_available']")[0].checked,
        skills: [],
        links: [],
        projects: []
      });
      this.$el.find("[data-skills] [data-tag]").each((function(_this) {
        return function(index, skill) {
          return _this.model.attributes.skills.push(skill.innerText);
        };
      })(this));
      this.$el.find("[data-link]").each((function(_this) {
        return function(index, link) {
          return _this.model.attributes.links.push({
            label: $(link).find("[data-link-label]").text(),
            url: $(link).find("[data-link-url]").text()
          });
        };
      })(this));
      this.$el.find("[data-project]").each((function(_this) {
        return function(index, project) {
          return _this.model.attributes.projects.push({
            title: $(project).find("[data-project-title]").text(),
            description: $(project).find("[data-project-description]").text(),
            contributions: $(project).find("[data-project-contributions]").text(),
            url: $(project).find("[data-project-url]").text(),
            image: $(project).find("[data-project-image]").attr("src").replace($(project).find("[data-project-image]").attr("data-image-cdn"), "")
          });
        };
      })(this));
      return Freelancer.__super__.save_edit.call(this);
    };

    Freelancer.prototype.change_is_available = function(e) {
      return this.$el.find("[data-dot]").attr("checked", e.currentTarget.checked);
    };

    Freelancer.prototype.add_link = function(e) {
      this.insert_link(e.currentTarget);
      return this.$el.find("[data-link-label]").last().focus();
    };

    Freelancer.prototype.remove_link = function(e) {
      return $(e.currentTarget).parents("[data-link]").remove();
    };

    Freelancer.prototype.add_project = function(e) {
      this.insert_project(e.currentTarget);
      return this.$el.find("[data-project-contributions]").last().focus();
    };

    Freelancer.prototype.remove_project = function(e) {
      return $(e.currentTarget).parents("[data-project]").remove();
    };

    Freelancer.prototype.show_edit = function(e) {
      e.preventDefault();
      window.history.replaceState(null, null, location.pathname + "?edit=true");
      return Core.edit_view.show(e);
    };

    Freelancer.prototype.insert_link = function(target) {
      return $(this.link_template()).insertBefore($(target));
    };

    Freelancer.prototype.insert_project = function(target) {
      return $(this.project_template()).insertBefore($(target));
    };

    return Freelancer;

  })(Core.Views.Editable);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Search = (function(superClass) {
    extend(Search, superClass);

    function Search() {
      return Search.__super__.constructor.apply(this, arguments);
    }

    Search.prototype.events = {
      "input [name='search']": "search_input"
    };

    Search.prototype.initialize = function() {
      return Search.__super__.initialize.call(this);
    };

    Search.prototype.render = function() {
      Search.__super__.render.call(this);
      return this;
    };

    Search.prototype.search_input = function(e) {
      if (this.input_timeout != null) {
        clearTimeout(this.input_timeout);
      }
      return this.input_timeout = setTimeout(function() {
        Turbolinks.controller.adapter.progressBar.setValue(0);
        Turbolinks.controller.adapter.progressBar.show();
        history.replaceState(null, null, "/freelancers/_search?query=" + e.currentTarget.value);
        return $.get("/freelancers/_search?query=" + e.currentTarget.value, function(response) {
          Turbolinks.controller.adapter.progressBar.setValue(100);
          Turbolinks.controller.adapter.progressBar.hide();
          return $("[data-freelancers]").html($(response).find("[data-freelancers]").html());
        });
      }, 333);
    };

    return Search;

  })(Core.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Header = (function(superClass) {
    extend(Header, superClass);

    function Header() {
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.el = $("#header");

    Header.prototype.events = {};

    Header.prototype.initialize = function() {
      return Header.__super__.initialize.call(this);
    };

    Header.prototype.render = function() {
      Header.__super__.render.call(this);
      this.$el.find("[data-sub]").each(function(index, sub) {
        var prev;
        prev = $(sub).prev();
        if (prev.length > 0) {
          return $(sub).css("left", prev.offset().left + 25);
        }
      });
      return this;
    };

    return Header;

  })(Core.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Core.Views.Navigation = (function(superClass) {
    extend(Navigation, superClass);

    function Navigation() {
      return Navigation.__super__.constructor.apply(this, arguments);
    }

    Navigation.prototype.user_nav_template = templates["user/nav"];

    Navigation.prototype.events = {
      "click [data-show-login]": "show_login",
      "click [data-show-signup]": "show_signup"
    };

    Navigation.prototype.initialize = function() {
      return Navigation.__super__.initialize.call(this);
    };

    Navigation.prototype.render = function() {
      Navigation.__super__.render.call(this);
      if (this.data.is_authenticated) {
        this.$el.find("[data-user-nav]").html(this.user_nav_template(this.data));
      }
      return this;
    };

    Navigation.prototype.show_login = function(e) {
      e.preventDefault();
      window.history.replaceState(null, null, location.pathname + "?login=true");
      return Core.login_view.show(e);
    };

    Navigation.prototype.show_signup = function(e) {
      e.preventDefault();
      window.history.replaceState(null, null, location.pathname + "?signup=true");
      return Core.login_view.show(e, 1);
    };

    return Navigation;

  })(Core.View);

}).call(this);
