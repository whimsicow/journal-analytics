const graph = (function() {

    // modifying the data returned from google analytics in order to render to graphs
  const getDates = ({data}) => {
      let pushedData1 = [];
      let pushedData2 = [];
      let beginningDate;
      let endingDate;
      const newData = data.rows

      for(let i = 0; i < newData.length; i++){
        if ((i === 0)) {
            beginningDate = newData[i].c[0].v.toString().split(' ').splice(1, 3).join(' ')
        }
        else if (i === newData.length-1) {
            endingDate = newData[i].c[0].v.toString().split(' ').splice(1, 3).join(' ')
        }
        pushedData1.push(newData[i].c[0].v.toString().split(' ').splice(0, 4).splice(1, 4).join(' '));
        pushedData2.push(newData[i].c[1].v);
      }

      return {
          dates: pushedData1,
          sessions: pushedData2,
          beginningDate,
          endingDate
      }
  }
 
  /*********************************************** overlay for main graph */
  const getGraphEvents = (userEvents, ga) => {
      //userevents is queried from db
      //ga from google db

    // copy googleanalytics dates arr
    let googleAnalyticDefaultDates = [...ga.dates]

    // copy userevents arr
    let userEventsArr = [...userEvents]

    // extract all event_dates from all users and put into new arr.
    let graphUserEvents = []
    for (n of userEventsArr) {
        graphUserEvents.push(n.event_date)
    }

    // remove duplicates from all user event_dates and to new arr.
    let duplicatesRemoved = []
    graphUserEvents.forEach(item => {
        if (duplicatesRemoved.find(x => x === item)) return;
        duplicatesRemoved.push(item)
    })
    // reverse the results so that they coincide with the way google analytics is rendering their dates
    // for quicker results..
    duplicatesRemoved.reverse()

    // diff array provided by google versus non-duplicate events
    // [sep 21, sep 22]...
    // if same dates are present in both arrays, push that item into new arr.. otherwise push invalid value such as a string which highcharts will see as invalid and will not plot that point on the overlay.
    let finalGraphEventsArr = googleAnalyticDefaultDates.map((item, index) => {
        if (duplicatesRemoved.find(x => x === item)) {
            return ga.sessions[index];
        }
        return '';
    })

    // return events dataset back to maingraph for overlay
    return finalGraphEventsArr
  }


  const getPieEvents = (userEvents, requestedMethod) => {

    // extract all methods from db query - events table
    let graphEventMethods = []
    for (n of userEvents) {
        graphEventMethods.push(n.method)
    }
    // get size of methods extracted
    let sizeOfEvents = graphEventMethods.length

    // if the requestedMethod (string) matches.. return the percentage
    let methodPercentage = ((graphEventMethods.filter(x => x === requestedMethod).length) / sizeOfEvents) * 100
    return methodPercentage;

  }
    // queried from googleAnalytics DB
    const gaDataForMainGraph = (googleAnalytics) => {
        var request = {};
        request['accountid'] =(googleAnalytics.response.profileInfo.accountId);
        request['propertyid'] = (googleAnalytics.response.profileInfo.webPropertyId);
        request['startdate'] = ((googleAnalytics.response.query['start-date']));
        request['enddate'] = (googleAnalytics.response.query['end-date']);
        
        // query from our own DB
        $.post('/api/events', request) 
            .then((res) => {
                let userEvents = res.map(x => {
                    let modifiedDate = x.event_date.slice(0, 10)
                    x.event_date = moment(modifiedDate).format('MMM DD YYYY')
                    return x
                })

                userEvents = res.map(x => {
                    let modifiedDate = x.date_added.slice(0, 10)
                    x.date_added = moment(modifiedDate).format('MMM DD YYYY')
                    return x
                })
               renderMainGraph(googleAnalytics, userEvents)
            })
            .catch((error) => {
                renderMainGraph(googleAnalytics, [])
            })

    }

    const gaDataForTrafficGraph = (googleAnalytics) => {
        var request = {};
        request['accountid'] =(googleAnalytics.response.profileInfo.accountId);
        request['propertyid'] = (googleAnalytics.response.profileInfo.webPropertyId);
        request['startdate'] = ((googleAnalytics.response.query['start-date']));
        request['enddate'] = (googleAnalytics.response.query['end-date']);
            
        renderTrafficGraph(googleAnalytics)
    }
    
    // render events
    const renderEvents = (googleAnalytics, userEvents, userDateClicked) => {

        // match date requested
        let filteredEventsByDate = userEvents.filter(x => x.event_date === userDateClicked)
        // early return for no events


        // sets date at top of modal. emptys .top-modal-info span if has been appended before
        let title = $('.top-modal-info')
        title.html("")
        let date = `Date: ${userDateClicked}`
        title.append(date)


    // if no events for day selected
      if (filteredEventsByDate.length === 0) {
        let parent = document.querySelector('.modal-list')
        let message = document.createElement('h2')
        message.textContent = 'No events for this date :('
        message.style.textAlign = 'left'
        parent.appendChild(message)
        return;
      }

      // render to modal
      filteredEventsByDate.forEach(x => {
        let firstname = capitalizeFirstLetter(x.firstname)
        let title = document.querySelector('.top-modal-info')
        let parent = document.querySelector('.modal-list')
        let linkWrapper = document.createElement('a')
        linkWrapper.href = ""
        let wrapper = document.createElement('div')
        let wrapper2 = document.createElement('div')
        wrapper.classList.add('event-item')
        wrapper2.classList.add('icon-image-modal')
        let name = document.createElement('p')
        name.textContent = `Posted by: ${firstname}`
        let method = document.createElement('p')
        method.textContent = `Method: ${x.method}`
        let img = document.createElement('img')
        let iconImage = chooseImgForMethod(x.method.trim())
        img.setAttribute("src", iconImage)
        img.setAttribute("alt", "icon")
        let description = document.createElement('p')
        description.textContent = `Description: ${x.description}`
        linkWrapper.appendChild(description)
        linkWrapper.appendChild(method)
        linkWrapper.appendChild(name)
        wrapper2.appendChild(img)
        linkWrapper.appendChild(wrapper2)
        wrapper.appendChild(linkWrapper)
        parent.appendChild(wrapper)
      })
      
  }
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // object for key/value pairs of methods and images
  // allows us to add icons to modal
  const chooseImgForMethod = (method) => {
      let newImage = {
          "General": "../images/defaulticon.svg",
          "Email": "../images/email.png",
          "Facebook": "https://cdn.worldvectorlogo.com/logos/facebook-icon.svg",
          "Tweet": "https://cdn.worldvectorlogo.com/logos/twitter-4.svg",
          "Google Plus": "../images/google-plus.svg",
          "Linkedin": "../images/linkedin.png",
          "Instagram" : "https://cdn.worldvectorlogo.com/logos/instagram-2016.svg",
          "Important" : "../images/importanticon.svg",
          "Outdoor" : "../images/tent.png",
          "Multiplatform" : "../images/multipleplatform.png",
          "Social" : "../images/socialevent.png"
      }
      return newImage[method]
  }

  // remove events
  const removeEvents = () => {
    const myNode = document.querySelector(".modal-list");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
  }
  // render graphs
  const renderMainGraph = (googleAnalytics, userEvents) => {
      mainGraph(googleAnalytics, userEvents)
      pieGraph(googleAnalytics, userEvents)
      console.log('highcharts main graph has been rendered')
  }
  const renderTrafficGraph = (googleAnalytics) => {
    trafficGraph(googleAnalytics)
    console.log('highcharts traffic graph has been rendered')
  }

  // main graph
  const mainGraph = (googleAnalytics, userEvents) => {
    console.log('configuring highcharts main graph')
    let ga = getDates(googleAnalytics)
    
    Highcharts.chart('main-container', {
      chart: {
          type: 'area',
          events: {
            load: () => {
                this.points = document.querySelectorAll('.highcharts-point')
                this.modal = document.getElementById('myModal');
                this.span= document.getElementsByClassName("close")[0];
                // when user clicks on [x], close it and remove events
                this.span.onclick = function() {
                  modal.style.display = "none"
                  removeEvents()
                }
                // When the user clicks anywhere outside of the modal, close it and remove events
                window.addEventListener('click', (e) => {
                  if (e.target == modal) {
                    this.modal.style.display = 'none'
                    removeEvents()
                  }
                })
            }
        }
      },
      title: {
          text: null
      },
      xAxis: {
          title: {
              text: `${ga.beginningDate} - ${ga.endingDate}`,
              margin: 20
          },
          gridLineColor: '#1C2630',
          categories: ga.dates,
          tickInterval: 5
      },
      yAxis: {
          title: {
              text: "Sessions",
              margin: 20
          },
          tickInterval: 50
      },
      tooltip: {
          crosshairs: true,
          shared: true
      },
      plotOptions: {
        series: {
            marker: {
              symbol: 'square',
              lineColor: '#3B5369'
            },
            lineColor: 'lightblue',
            cursor: 'pointer',
            point: {
              events: {
                click: (e) => {
                  this.modal.style.display = 'block'
                  renderEvents(googleAnalytics, userEvents, e.point.category)
                }
              }
            }
      }},
      series: [{
          name: `${userEvents[0].accountname}`,
          marker: {
              symbol: 'circle',
              width: 16,
              height: 16
          },
          data: ga.sessions
          },
          {
            name: `User: ${gapi.analytics.auth.getUserProfile().name.split(' ').map(x => { let maxLength = x.length; return x[0].toUpperCase() + x.slice(1, maxLength)}).join(' ')}`,
            marker: {
              symbol: 'circle',
              width: 16,
              height: 16
            }
          },
          {
            name: 'Events',
            color: '#9DC8F1',
            data: getGraphEvents(userEvents, ga),
            marker: {
                lineColor: '#fff',
                symbol: 'url(../images/plusgraphicon.svg)'
            }
          }
        ]
  });
  }

  // pie graph
  const pieGraph = (googleAnalytics, userEvents) => {
    console.log('configuring highcharts main graph')
    let ga = getDates(googleAnalytics)

    Highcharts.chart('event-pie-graph', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            backgroundColor: null,
            // height: 300
        },
        title: {
            text: null
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.0f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#395062'
                    }
                }
            }
        },
        series: [{
            name: 'Sessions',
            colorByPoint: true,
            data: [{
                name: 'Email',
                y: getPieEvents(userEvents, 'Email')
            }, {
                name: 'Social',
                y: getPieEvents(userEvents, 'Social')
            }, {
                name: 'General',
                y: getPieEvents(userEvents, 'General'),
                sliced: true,
                selected: true
            }, {
                name: 'Outdoor',
                y: getPieEvents(userEvents, 'Outdoor'),
            },{
                name: 'Important',
                y: getPieEvents(userEvents, 'Important'),
            },{
                name: 'Google Plus',
                y: getPieEvents(userEvents, 'Google Plus'),
            },{
                name: 'Facebook',
                y: getPieEvents(userEvents, 'Facebook'),
            },
            {
                name: 'Multiplatform',
                y: getPieEvents(userEvents, ga, 'Multiplatform'),
            },{
                name: 'LinkedIn',
                y: getPieEvents(userEvents, ga, 'LinkedIn'),
            }]
        }]
    });
  }

  // traffic graph
  const trafficGraph = (googleAnalytics) => {
      console.log('configuring highcharts traffic graph')
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
            lineColor: '#eee',
            categories: ['Aug 15, 2017', 'Aug 16, 2017', 'Aug 17, 2017', 'Aug 18, 2017', 'Aug 19, 2017', 'Aug 20, 2017', 'Aug 21, 2017', 'Aug 22, 2017'],
            tickInterval: 1,
            labels: {
                style: {
                    color: '#999999'
                },
                y: 35
            },
            title: {
                text: `${'Aug 15, 2017'} - ${'Aug 22, 2017'}`,
                margin: 20
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
            max: 10,
            tickInterval: 1,
            labels: {
              style: {
                  color: '#999999',
                  fontSize: '9px'
              }
            },
            title: {
                text: "Visits"
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
            align: 'center',
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
            name: 'Facebook',
            data: [9, 10, 8, 9, 3, 0, 5, 0],
            color: '#6693E5',
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/facebook-icon.svg)',
                width: 16,
                height: 16
            }
        }, {
            name: 'Twitter',
            data: [0, 6, 0, 1, 0, 0, 1, 1],
            color: '#7DCAFD',
            visible: false,
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/twitter-4.svg)',
                width: 16,
                height: 16
            }
        }, {
            name: 'Reddit',
            data: [2, 1, 0, 0, 0, 0, 0, 0],
            color: '#115EA3',
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/reddit-2.svg)',
                width: 16,
                height: 16
            }
        }, {
            name: 'LinkedIn',
            data: [0, 6, 2, 6, 3, 0, 0, 0],
            color: '#D64857',
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/linkedin-icon-1.svg)',
                width: 16,
                height: 16
            }
        },{
            name: 'Meetup',
            data: [0, 0, 2, 0, 0, 0, 0, 0],
            color: '#6d48d6',
            visible: false,
            marker: {
                symbol: 'url(https://cdn.worldvectorlogo.com/logos/meetup-1.svg)',
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
      gaDataForMainGraph,
      gaDataForTrafficGraph
  }
})()
