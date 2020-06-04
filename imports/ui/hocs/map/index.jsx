import React from 'react';
import './index.scss'
import LogisticMap from '../../reusable/Logisticmap'

const data_left = {
  name: '',
  children: [
    {
      name: 'Instructional Programs',
      // pathProps: {className: 'black'},
      children: [
        {
          name: "Instructional Design",
          children: [
            {
              name: "Distance/Blended Learning"
            },
            {
              name: "Curriculum"
            },
            {
              name: "Assessment / Grading / Testing"
            },
            {
              name: "Field Trips / Work Based Learning"
            },
          ]
        },
        {
          name: "Special Student Needs",
          children: [
            {
              name: "Special Education"
            },
            {
              name: "English Learners"
            },
            {
              name: "S504"
            }
          ]
        },
        {
          name: "Extra Curricular",
          children: [
            {name: ""}
          ]
        },
        {
          name: "Structure",
          children: [
            {
              name: "Internet/Tech Access"
            },
            {
              name: "Master Scheduling / Teachder Schedules",
              pathProps: {className: 'black'},
            },
            {
              name: "Schedule",
              pathProps: {className: 'black'},
            },
            {
              name: "Classroom Management"
            },
            {
              name: "Before/After School Programs"
            },
            {
              name: "Academic Guidance"
            },
          ]
        }        
      ]
    }, 
    {
      name: 'Student Support & Family Engagement',
      children: [
        {
          name: "Basic Needs (Food, Housing, etc)"
        },
        {
          name: "Social Emotional Support"
        },
        {
          name: "Outreach to Hard to Find Students"
        },
        {
          name: "Referrals to 3rd party Service Providers"
        },
        {
          name: "Parent Social/Emotional Support"
        },
        {
          name: "Parent Input / Decision-making"
        },
      ]
    }
  ]
};
const data_right = {
  name: "",
  children: [
    {
      name: "Health & Safety / Operations",
      children: [
        {
          name: "Potential COVID-19 Case Protocols",
          children: [
            {
              name: "Students"
            },
            {
              name: "Staff"
            }
          ]
        },
        {
          name: "Snaitizing / Disinfecting",
          children: [
            {
              name: "PPE/Equipment"
            },
            {
              name: "Schedules"
            }
          ]
        },
        {
          name: "Support for Staff",
          children: [
            {
              name: "Socal Emotional Support"
            },
            {
              name: "Childcare"
            }
          ]
        },
        {
          name: "Attendance",
          children: [
            {
              name: "Enrollment"
            },
            {
              name: "SIS"
            }
          ]
        },
        {
          name: "Transportation",
          children: [
            {
              name: "Special Ed"
            },
            {
              name: "Regular Ed"
            },
            {
              name: "Bus Stops"
            }
          ]
        },
        {
          name: "Facilities",
          children: [
            {
              name: "Water"
            },
            {
              name: "Office layouts"
            },
            {
              name: "Health Office / Quarantine"
            },
            {
              name: "Open Spaces"
            },
            {
              name: "Bathroom Protocols"
            },
            {
              name: "Classroom Layouts"
            },
            {
              name: "Air Circulation"
            },
          ]
        },
        {
          name: "Arrival / Dismissal Protocols",
          children: [
            {
              name: "Visitor Protocols"
            },
            {
              name: "Temperature Screening"
            },
            {
              name: "Self Screening"
            }
          ]
        },
        {
          name: "Food Services / Lunch",
          children: [
            {
              name: "Delivery"
            },
            {
              name: "Food Prep"
            }
          ]
        },
        {
          name: "PE / Extra Curriculars",
          children: [
            {
              name: "PE"
            },
            {
              name: "Athletics"
            },
            {
              name: "Clubs"
            }
          ]
        },
      ]
    }
  ]
}
const Map = () => {
  return (
    <div>
      <svg height="900" width="100%">
      <LogisticMap data={data_left} isLeft/>
      <svg xmlns="http://www.w3.org/2000/svg" width="210" height="50" transform="translate(500, 500)">
        <polygon points="10,0 200,0 200,20 210,25 200,30 200,50 10,50 10,30 0,25 10,20 10,0"  style={{fill:"grey", stroke:"grey", strokeWidth:1}} />
        <text x="0" y="15" fill="black" transform="translate(40, 20)">Logistics Map</text>
      </svg>      
      <LogisticMap data={data_right} />
      </svg>
    </div>
  )
}

export default Map
