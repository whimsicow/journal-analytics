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
    get() - Returns the current configuration options of a component.*/

/******************************************************************
                            HELPER for annual graph
******************************************************************/
// for google embed default graph (annual)
function query(params) {
    return new Promise(function (resolve, reject) {
        const data = new gapi.analytics.report.Data({ query: params });
        data.once('success', function (response) { resolve(response); })
            .once('error', function (response) { reject(response); })
            .execute();
    });
}

// for google embed default graph (annual)
function makeCanvas(id) {
    const container = document.getElementById(id);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    container.innerHTML = '';
    canvas.width = 500;
    canvas.height = 500;
    container.appendChild(canvas);

    return ctx;
}

Chart.defaults.global.animationSteps = 60;
Chart.defaults.global.animationEasing = 'easeInOutQuart';
Chart.defaults.global.responsive = true;
Chart.defaults.global.maintainAspectRatio = false;

/******************************************************************
                GOOGLE ANALYTICS AUTHENTICATION
******************************************************************/

$(document).ready(() => {
    setTimeout(function(){
        $('body').addClass('loaded');
    }, 3000);

  gapi.analytics.ready(() => {
    var signedIn = false;
    gapi.analytics.auth.authorize({
        // auth-container is dom element that hosts the sign-in button during a sessions first load. sign in button can also contain an event listener to do something     else as well
        container: 'embed-api-auth-container',
        //client ID of our project from developers console (using Sarahs)
        clientid: CLIENT_ID
    })

    // return user info to console when they sign in... (name, email, profilePic)
    gapi.analytics.auth.on('signIn', function() {
        const profile = gapi.analytics.auth.getUserProfile();
        $.post('/users/profile', profile);
        $.post('/api/picture', profile)
            .then(setPicture)
    })

    // If user is not authorized via Google Analytics, display error message
    gapi.analytics.auth.on('needsAuthorization', function() {
        $('.all-charts-container').empty();
        $('.selector-container').empty();
        $('.view-selector-container').empty();
        $('.user-info-container').empty();
        $('.add-event-button').remove();
        $('.all-charts-container').append($('<h2></h2>', {
            'text': 'It appears you do not have an account set up with Google Analytics. Please create an account to start visualizing your site data.',
            'class': 'ga-error'
        }));
    })
    function setPicture(result) {
        $('[data-role="profilepic"]').attr("src", result.picture); 
    }
    // console.log(gapi.analytics.auth.getUserProfile());
    // console.log(gapi.analytics.auth.isAuthorized());
    //     console.log('whoaaa');
    //     // sarah does magic here
    // }
    // console.log(signedIn);
        /******************************************************************
                                    MAIN GRAPH
        ******************************************************************/
        /******************************* CONFIG */
        const mainGraphConfig = {
            query: {
                metrics: 'ga:sessions',
                dimensions: 'ga:date'
            },
            chart: {
                type: 'LINE',
                options: {
                    color: 'red',
                    legend: 'middle',
                    is3D: true,
                    width: '100%',
                    fontSize: 16 // font size for pop-up window when hovering over a data plot from the graph
                }
            }
        }
        // default date range
        const mainGraphDateRange = {
            'start-date': '30daysAgo',
            'end-date': '0daysAgo'
        }

        /******************************* GRAPH CONSTRUCTOR */
        const mainGraph = new gapi.analytics.googleCharts.DataChart(mainGraphConfig)
            .set(
            {
                query: mainGraphDateRange
            })
            .set(
            {
                chart: {
                    container: 'template-container'
                }
            })
        /******************************************************************
                                    TRAFFIC GRAPH
        ******************************************************************/
        /******************************* CONFIG */
        const trafficGraphConfig = {
            query: {
                metrics: 'ga:sessions',
                dimensions: 'ga:date'
            },
            chart: {
                type: 'LINE',
                options: {
                    color: 'red',
                    legend: 'middle',
                    is3D: true,
                    width: '100%',
                    fontSize: 16 // font size for pop-up window when hovering over a data plot from the graph
                }
            }
        }
        // default date range
        const trafficGraphDateRange = {
            'start-date': '30daysAgo',
            'end-date': '0daysAgo'
        }

        /******************************* GRAPH CONSTRUCTOR */
        const trafficGraph = new gapi.analytics.googleCharts.DataChart(trafficGraphConfig)
            .set(
            {
                query: trafficGraphDateRange
            })
            .set(
            {
                chart: {
                    container: 'template-container-2'
                }
            })

        /******************************************************************
                                    ANNUAL GRAPH
        ******************************************************************/
        function renderYearOverYearChart(ids) {
            
            // Adjust `now` to experiment with different days, for testing only...
            const now = moment(); // .subtract(3, 'day');

            const thisYear = query({
                'ids': ids,
                'dimensions': 'ga:month,ga:nthMonth',
                'metrics': 'ga:users',
                'start-date': moment(now).date(1).month(0).format('YYYY-MM-DD'),
                'end-date': moment(now).format('YYYY-MM-DD')
            });

            const lastYear = query({
                'ids': ids,
                'dimensions': 'ga:month,ga:nthMonth',
                'metrics': 'ga:users',
                'start-date': moment(now).subtract(1, 'year').date(1).month(0)
                    .format('YYYY-MM-DD'),
                'end-date': moment(now).date(1).month(0).subtract(1, 'day')
                    .format('YYYY-MM-DD')
            });

            Promise.all([thisYear, lastYear]).then(function (results) {
                const data1 = results[0].rows.map(function (row) { return +row[2]; });
                const data2 = results[1].rows.map(function (row) { return +row[2]; });
                const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                // Ensure the data arrays are at least as long as the labels array.
                // Chart.js bar charts don't (yet) accept sparse datasets.
                for (var i = 0, len = labels.length; i < len; i++) {
                    if (data1[i] === undefined) data1[i] = null;
                    if (data2[i] === undefined) data2[i] = null;
                }

                const data = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Last Year',
                            fillColor: '#BDDAF5',
                            strokeColor: '#BDDAF5',
                            data: data2
                        },
                        {
                            label: 'This Year',
                            fillColor: '#808F9E',
                            strokeColor: 'rgba(151,187,205,1)',
                            data: data1
                        }
                    ]
                };

                const annualGraph = new Chart(makeCanvas('annual-graph-container')).Bar(data);
            })
                .catch(function (err) {
                    console.error(err.stack);
                });
        }

        /******************************************************************
                            GOOGLE ANALYTICS HEADER INFO
        ******************************************************************/

        /*********************************** ACTIVE USERS */
        const activeUsers = new gapi.analytics.ext.ActiveUsers(
            {
                container: 'active-users-container',
                pollingInterval: 5
            })

        /********************************** VIEWSELECTOR CONSTRUCTOR*/
        const viewSelector = new gapi.analytics.ext.ViewSelector2(
            {
                container: 'view-selector-container'
            })
            .execute()
        const viewSelectorForm = new gapi.analytics.ext.ViewSelector2({
            container: 'view-selector-container2'
        })
            .execute();

        const viewSelectorMembers = new gapi.analytics.ext.ViewSelector2({
            container: 'members-view-selector-container'
        })
            .execute();
        

        /********************************** DATERANGE CONSTRUCTOR*/
        const dateRangeSelector1 = new gapi.analytics.ext.DateRangeSelector(
            {
                container: 'date-range-selector-container'
            })
            .set(mainGraphDateRange)
            .execute()



        /******************************************************************
                                    LISTENERS
        ******************************************************************/

        /***************************************** MAIN GRAPH */
        mainGraph.on('success', (result) => {
            console.groupCollapsed('Query was successful and Google Analytics Default Graph has been rendered -- (display: none)')
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
            
            // save global for later usage during saving form
            this.gaData = result;
            graph.gaDataForMainGraph(result)
        })
        
        mainGraph.on('error', (result) => {
            console.log('Error occured during query or rendering')
        })

        /***************************************** TRAFFIC GRAPH */
        trafficGraph.on('success', (result) => {
            console.groupCollapsed('Query was successful and Google Analytics Default Graph has been rendered -- (display: none)')
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
            
            graph.gaDataForTrafficGraph(result)
        })
        
        trafficGraph.on('error', (result) => {
            console.log('Error occured during query or rendering')
        })

        /************************************** VIEW SELECTORS */
        viewSelector.on('viewChange', (data) => {
            // main graph
            mainGraph.set({
                query: {
                    ids: data.ids
                }
            })
            .execute()

            // traffic graph
            trafficGraph.set({
                query: {
                    ids: data.ids
                }
            })
            .execute()

            // annual graph
            renderYearOverYearChart(data.ids);


            // active users
            // activeUsers.set(data)
            // .execute()

            // updates title 
            const title = document.getElementById('view-name')
            title.textContent = `${data.property.name}`
        })

        /************************************* DATE RANGE SELECTOR*/
        dateRangeSelector1.on('change', (data) => {
            // updates graph
            mainGraph.set({
                query: data // new start date and end date
            })
            .execute()

            trafficGraph.set({
                query: data
            })
            .execute()

            // Update the "from" dates text.
            const datefield = document.getElementById('from-dates')
            datefield.textContent = `${data['start-date']} '&mdash' ${data['end-date']}`
        })

        /************************************* ACTIVE USERS */
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
              }, 60000);
            });
        });
    })
    
})
