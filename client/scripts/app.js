var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    this.set('like', !this.get('like'));
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    this.on('change', function() {      
      this.sort();
    });
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    this.sort();
  }

});
// Responsible for the HTML display of the data and click events
var MovieView = Backbone.View.extend({
  
  template: _.template('<div class="movie"> \
  <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.render();
    this.model.on('change:like', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function(e) {
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({
  // in a view that references a collection, don't forget to pass in the this binding to make sure 
  initialize: function() {
    this.collection.on('sort', function() {
      this.render();
    }, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
// gets passed a collection of movies, which it passes to moviesView to render
var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function (e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function () {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});
  