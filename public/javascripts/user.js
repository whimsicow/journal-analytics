$(document).ready(() => {
  //fetch events data from db
  window.fetch('http://localhost:3737/api/events')
  .then(response => response.json())
  .then(results => {
    graph.catpureEventsData(results)
  })
    
})