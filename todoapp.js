//  Collection to store to-do items
Todos = new Meteor.Collection('todos');

if (Meteor.isClient) {
  Template.todo_list.helpers({
    todos: function(){
      return Todos.find();
    },
    todosCount: function(){
      return Todos.find({completed: false}).count();
    }
  });

  Template.todo_list.events({
    'click .todo-done':function(){
      Meteor.call('updateTodo', this._id, !this.completed);
    }
  });

  Template.todo_input.events({
    'submit form': function(event, template){
      event.preventDefault();
      var input = template.find('.todo-add');
      //  Ensure the user does not enter blank document into MongoDB collection.
      if(!input.value)
      {
        return false;
      }
      Meteor.call('addTodo', input.value);
      input.value = "";
    },
    'click .clear': function(){
      Meteor.call('clearCompleted');
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    addTodo: function(title){
      Todos.insert({
        title: title,
        completed: false
      });
    },
    updateTodo: function(id, value){
      Todos.update(id, {
        $set:{completed: value}
      });
    },
    clearCompleted: function(){
      Todos.remove({
        completed: true
      });
    }
  })
}
