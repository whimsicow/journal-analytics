const graph = (function() {
  let EVENTS;

  const getDates = ({data}) => {
      let pushedData1 = [];
      let pushedData2 = [];
    //   console.log(data);
      const newData = data.rows
    //   console.log(newData)
      for(let i = 0; i < newData.length; i++){
         pushedData1.push((newData[i].c[0].v).toString());
         pushedData2.push(newData[i].c[1].v);
      }
    //   console.log(pushedData1)
    //   console.log(pushedData2)

      return {
          dates: pushedData1,
          sessions: pushedData2
      }
  }

  const getSessions = ({ data }) => {
    console.log(data.rows[0].c[1].v) // sessions
  }

  // from user.js -- queried from restful api via our DB
  const catpureEventsData = (result) => {
    EVENTS = result;
  }

  // from chart.js -- queried from googleAnalytics DB
  const captureGoogleAnalyticsData = (result) => {
    renderGraphs(result, EVENTS)
  }

  // render graphs
  const renderGraphs = (result, EVENTS) => {
    mainGraph(result, EVENTS)
    console.log('main graph has been rendered')
    trafficGraph(result, EVENTS)
    console.log('traffic graph has been rendered')
  }

  // main graph
  const mainGraph = (googleAnalytics, events) => {
    console.log('configuring highcharts main graph')
    let ga = getDates(googleAnalytics);

    Highcharts.chart('main-container', {
      chart: {
          type: 'area'
      },
      xAxis: {
          title: {
              text: 'Date'
          },
          categories: ga.dates
      },
      yAxis: {
          title: {
              text: "Sessions"
          },
          // labels: {
          //     formatter: function () {
          //         return this.value + 'Count';
          //     }
          // }
      },
      tooltip: {
          crosshairs: true,
          shared: true
      },
      plotOptions: {
        area: {
          fillColor: {
              linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
              },
              stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
              ]
          }
        }
      },
      series: [{
          name: `Team: ${events.team_id}`,
          marker: {
              symbol: 'circle',
              width: 16,
              height: 16
          },
          data: ga.sessions
          },
          {
            name: `User: ${events.email}`,
            marker: {
              symbol: 'circle',
              width: 16,
              height: 16
            }
          }
        ]
  });
  }

  // traffic graph
  const trafficGraph = (googleAnalytics, events) => {
      console.log('configuring traffic graph')
      let a = googleAnalytics[0]
      let ga = getDates(googleAnalytics);

      Highcharts.chart('traffic-container', {
        credits: {
              enabled: false
        },
        chart: {
          type: 'area',
          marginRight: 50,
          spacingLeft: 50,
          spacingBottom: 50
        },
        title: {
            text: false
        },
        subtitle: {
            text: false,
        },
        xAxis: {
            lineColor: '#eeeeee',
            categories: ['18. Sep', '19. Sep', '20. Sep', '21. Sep', '22. Sep', '23. Sep', '24. Sep', '25. Sep'],
            labels: {
              style: {
                  color: '#999999'
              },
              y: 35
            },
            tickColor: '#eeeeee',
            tickmarkPlacement: 'on'
        },
        yAxis: {
            gridLineColor: '#eeeeee',
            title: {
                text: false
            },
            min: 0,
            max: 500,
            tickInterval: 50,
            labels: {
              style: {
                  color: '#999999',
                  fontSize: '9px'
              }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            backgroundColor: 'white',
            borderColor: null,
            borderWidth: null
        },
        legend: {
            layout: 'horizontal',
            align: 'left',
            verticalAlign: 'top',
            symbolHeight: 11,
            symbolWidth: 11,
            symbolPadding: 10,
            borderWidth: 0,
            y: -10,
            x: -15,
            padding: 15,
            itemDistance: 35,
            itemMarginTop: 5,
            itemMarginBottom: 5,
            itemStyle: { 
              color: "#2D282A",
              fontSize: 12,
              fontWeight: 'normal'
            }
        },
        plotOptions: {
            area: {
              lineWidth: 0,
              marker: {
                symbol: 'square'
              }
            },
            series: {
              fillOpacity: 0.1,
              stickyTracking: false,
              states: {
                    hover: {
                        halo: {
                            size: 8
                        }

                    }
                }
            }
        },
        series: [{
            name: 'Total Visits',
            data: [300, 250, 250, 150, 200, 50, 300, 300],
            color: '#D64857',
            marker: {
                symbol: 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/252775/graph-red.svg)',
                width: 16,
                height: 16
            },
        }, {
            name: 'Facebook',
            data: [500, 495, 395, 400, 422, 484, 320, 120],
            color: '#6693E5',
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/facebook-icon.svg)',
                width: 16,
                height: 16
            }
        }, {
            name: 'Twitter',
            data: [64, 99, 200, 123, 234, 345, 123, 335],
            color: '#7DCAFD',
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/twitter-4.svg)',
                width: 16,
                height: 16
            }
        }, {
            name: 'Tumblr',
            data: [150, 200, 349, 500, 400, 259, 200, 50],
            color: '#115EA3',
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/tumblr-icon.svg)',
                width: 16,
                height: 16
            }
        }, {
            name: 'Linkedin',
            data: [30, 30, 40, 210, 100, 300, 450, 500],
            color: '#727272',
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/linkedin-icon-1.svg)',
                width: 16,
                height: 16
            }
        }, {
            name: 'Instagram',
            data: [0, 5, 10, 20, 50, 400, 30, 350],
            color: '#d79e64',
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/instagram-2016.svg)',
                width: 16,
                height: 16
            }
        }]
    })};
      
    // return public methods exposed globally
    // can call in other files with graph.mainGraph
  return {
      mainGraph,
      trafficGraph,
      catpureEventsData,
      captureGoogleAnalyticsData
  }

})()
