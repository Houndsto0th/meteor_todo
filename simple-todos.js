Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");

    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      var text = event.target.text.value;
      Tasks.insert({
        text: text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
      });

      event.target.text.value = "";

      return false;
    },

    "click .toggle-checked": function () {
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },

    "click .delete": function () {
      Tasks.remove(this._id);
    },

    "change .hide-completed": function () {
        Session.set("hideCompleted", event.target.checked)
    }

  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
