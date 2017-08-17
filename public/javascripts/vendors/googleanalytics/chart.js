/********************************* CLIENT ID FOR USERS TO HAVE ACCESS TO DIGITAL CRAFTS*/
const CLIENT_ID = '456569075688-n6uo0irm3rf0pjticr9ntjir3qmfa9uh.apps.googleusercontent.com';


/****************************************************************** 
                          READ ME STUFF
*******************************************************************

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

/******************************************************************
                    LOAD GOOGLE ANALYTICS LIBRARY (gives us gapi api)
******************************************************************/
(function(w,d,s,g,js,fs){
  g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(f){this.q.push(f);}};
  js=d.createElement(s);fs=d.getElementsByTagName(s)[0];
  js.src='https://apis.google.com/js/platform.js';
  fs.parentNode.insertBefore(js,fs);js.onload=function(){g.load('analytics');};
}(window,document,'script'));


/******************************************************************
                GOOGLE ANALYTICS SETUP FOR API CALL
******************************************************************/
$(document).ready(() => {
  gapi.analytics.ready(() => {
    
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
    const mainGraphConfig = {
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

    const mainGraphDateRange = {
      'start-date': '14daysAgo',
      'end-date': '1daysAgo'
    }

    /************************************************************** CHART */
    /**
     * Create a new DataChart instance with the given query parameters
     * and Google chart options. It will be rendered inside an element
     * with the id "chart-container".
     */
    const mainGraph = new gapi.analytics.googleCharts.DataChart(mainGraphConfig)
    .set(
      {
        query: mainGraphDateRange
      })
    .set(
      {
        chart: {
          container: 'chart-container'
        }
      })

   /************************************************************** ACTIVEUSERES */

    const activeUsers = new gapi.analytics.ext.ActiveUsers({
    container: 'active-users-container',
    pollingInterval: 5
    });

    /************************************************************** DATERANGE */
    /**
     * Create a new DateRangeSelector instance to be rendered inside of an
     * element with the id "date-range-selector-1-container", set its date range
     * and then render it to the page.
     */

    const dateRangeSelector1 = new gapi.analytics.ext.DateRangeSelector({
      container: 'date-range-selector-container'
    })
    .set(mainGraphDateRange)
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
    mainGraph.on('success', (result) => {
      console.groupCollapsed('Query was successful and Graph has been rendered')
      console.group('Raw Data')
      console.log(result.data) // raw data of the graph values (x, y, and graph points)
      console.groupEnd()
      console.group('Chart Info')
      console.log(result.chart) // gives info of chart.. can manipulate chart using js/jquery with this info )
      console.groupEnd()
      console.group('Entire Raw Response')
      console.log(result.response) // raw data of the entire response... )
      console.groupEnd()
      console.groupEnd()
    })

    mainGraph.on('error', (result) => {
      console.log('Error occured during query or rendering')
    })

    /************************************************************** LISTENER FOR ACTIVE USERES */
    activeUsers.once('success', function() {
    var element = this.container.firstChild;
    var timeout;

    this.on('change', function(data) {
      var element = this.container.firstChild;
      var animationClass = data.delta > 0 ? 'is-increasing' : 'is-decreasing';
      element.className += (' ' + animationClass);

      clearTimeout(timeout);
      timeout = setTimeout(function() {
        element.className =
            element.className.replace(/ is-(increasing|decreasing)/g, '');
      }, 3000);
    });
  });

    /************************************************************** LISTENER FOR VIEW SELECTORS */
    viewSelector.on('viewChange', (data) => {
      // updates graph
      mainGraph.set({
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
      mainGraph.set({
        query: data
      })
      .execute()

      // Update the "from" dates text.
      const datefield = document.getElementById('from-dates')
      datefield.textContent = `${data['start-date']} '&mdash' ${data['end-date']}`
    })
  })

    /************************************************************** EVENTS PIE GRAPH
     * 
     */
      // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'SocialMedia');
        data.addColumn('number', 'Hits');
        data.addRows([
          ['Facebook', 3],
          ['Twitter', 1],
          ['Instagram', 1],
          ['LinkedIn', 1],
        ]);

        // Set chart options
        var options = {'title':'Events',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }

})
