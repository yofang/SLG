tapp.
  directive('ngjqDraggable', function ($document) {//yoyo:creating a ng directive which config the dragged external items of fullcalendar
      return function (scope, element, attr) {

          // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
          // it doesn't need to have a start or end
          var eventObjectId = scope.task.id;

                    // store the Event Object ID in the DOM element so we can get to it later
          $(element).data('eventObjectId', eventObjectId);

          // make the event draggable using jQuery UI
          element.draggable({
              zIndex: 999,
              revert: true,      // will cause the event to go back to its
              revertDuration: 0  //  original position after the drag
          });
          
      };
      
  });
