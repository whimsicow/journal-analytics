/****************************************************************** READ ME STUFF
 Google Analytic main Methods:
    static method - gapi.analytics.ready()
    static method - gapi.analytics.auth.authorize()
    constructor - gapi.analytics.googleCharts.Datachart()
    constructor - gapi.analytics.ext.DateRangeSelector()
    constructor - gapi.analytics.ext.ViewSelector2()


 Google Analytic extended Methods:
    set() - Sets or updates the component's configuration options (this can also be done at creation time in the constructor).
    execute() - Invokes the component's primary action. This is usually rendering something on the page or running a report (or both).
    get() - Returns the current configuration options of a component.
*******************************************************************/



/****************************************************************** LOAD GOOGLE ANALYTICS LIBRARY */
(function(w,d,s,g,js,fs){
  g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(f){this.q.push(f);}};
  js=d.createElement(s);fs=d.getElementsByTagName(s)[0];
  js.src='https://apis.google.com/js/platform.js';
  fs.parentNode.insertBefore(js,fs);js.onload=function(){g.load('analytics');};
}(window,document,'script'));


$(document).ready(() => {
  gapi.analytics.ready(() => {


    /****************************************************************** AUTHORIZE USER */
    const CLIENT_ID = '456569075688-n6uo0irm3rf0pjticr9ntjir3qmfa9uh.apps.googleusercontent.com';
    
    gapi.analytics.auth.authorize({
        // auth-container is dom element that hosts the sign-in button during a sessions first load. sign in button can also contain an event listener to do something     else as well
        container: 'embed-api-auth-container',
        //client ID of our project from developers console (using Sarahs)
        clientid: CLIENT_ID,
    })

    // return user info to console when they sign in... (name, email, profilePic)
    gapi.analytics.auth.on('signIn', function() {
      console.groupCollapsed(`User has been authenticated and has signed in.`)
      console.log(gapi.analytics.auth.getUserProfile())
      console.groupEnd()
    })


    /************************************************************** CONFIGS */
    const commonConfig = {
      query: {
        metrics: 'ga:sessions',
        dimensions: 'ga:date'
      },
      chart: {
        type: 'COLUMN',
        options: {
            color: 'red',
            legend: 'middle',
            is3D: true,
            width: '100%',
            title: 'Sessions for the past 2 weeks',
            fontSize: 16 // font size for pop-up window when hovering over a data plot from the graph
        }
      }
    }

    const dateRange1 = {
      'start-date': '14daysAgo',
      'end-date': '8daysAgo'
    }

    /************************************************************** CHART */
    /**
     * Create a new DataChart instance with the given query parameters
     * and Google chart options. It will be rendered inside an element
     * with the id "chart-container".
     */
    const dataChart1 = new gapi.analytics.googleCharts.DataChart(commonConfig)
    .set({
      query: dateRange1
    })
    .set(
      {chart: {container: 'chart-container'}}
    )


    /************************************************************** DATERANGE */
    /**
     * Create a new DateRangeSelector instance to be rendered inside of an
     * element with the id "date-range-selector-1-container", set its date range
     * and then render it to the page.
     */

    const dateRangeSelector1 = new gapi.analytics.ext.DateRangeSelector({
      container: 'date-range-selector-container'
    })
    .set(dateRange1)
    .execute()


    /************************************************************** VIEWSELECTOR */
    /**
     * Create a new ViewSelector2 instance to be rendered inside of an
     * element with the id "view-selector-container".
     */
    const viewSelector = new gapi.analytics.ext.ViewSelector2({
      container: 'view-selector-container'
    })
    .execute()

    /************************************************************** LISTENER FOR CHART */
    dataChart1.on('success', (result) => {
      console.groupCollapsed('Query was successful and Graph has been rendered')
      console.group('Raw Data')
      console.log(result.data) // raw data of the graph values (x, y, and graph points)
      console.group('Chart Info')
      console.log(result.chart) // gives info of chart.. can manipulate chart using js/jquery with this info )
      console.group('Entire Raw Response')
      console.log(result.response) // raw data of the entire response... )
      console.groupEnd()
    })

    dataChart1.on('error', (result) => {
      console.log('Error occured during query or rendering')
    })

    /************************************************************** LISTENER FOR VIEW SELECTORS */
    viewSelector.on('viewChange', (data) => {
      // updates graph
      dataChart1.set({
        query: {
          ids: data.ids
        }
      })
      .execute()

      // updates title 
      const title = document.getElementById('view-name')
      title.textContent = `${data.property.name} ${data.view.name}`
    })

    /************************************************************** LISTENER FOR DATE RANGE SELECTOR*/
    dateRangeSelector1.on('change', (data) => {
      // updates graph
      dataChart1.set({
        query: data
      })
      .execute()

      // Update the "from" dates text.
      const datefield = document.getElementById('from-dates')
      datefield.textContent = `${data['start-date']} '&mdash' ${data['end-date']}`
    })
  })
})
